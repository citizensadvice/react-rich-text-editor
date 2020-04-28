function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Editor } from 'slate-react';
import Plain from 'slate-plain-serializer';
import { Value } from 'slate';
import { IS_BOLD_HOTKEY, IS_ITALIC_HOTKEY, IS_UNDERLINED_HOTKEY } from './constants';
import { onLinkPaste, renderInline } from './link';
import { renderMark, renderBlock } from './utils';
import initialValue from './value.json'; // import EditorLinkModal from './components/EditorLinkModal';

import EditorLabel from './components/EditorLabel';
import EditorToolbar from './components/EditorToolbar'; // import LabelledTextarea from '../LabelledTextarea';

import './index.scss';
const initialValue1 = Value.fromJSON(initialValue);
const initialValue2 = Value.fromJSON(initialValue);

class LabelledRichTextEditor extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "containerRef", React.createRef());

    _defineProperty(this, "editor1", React.createRef());

    _defineProperty(this, "editor2", React.createRef());

    _defineProperty(this, "ref1", editor1 => {
      this.editor1 = editor1;
    });

    _defineProperty(this, "ref2", editor2 => {
      this.editor2 = editor2;
    });

    _defineProperty(this, "handlingStateFromChild", newState => {
      this.setState(newState);
    });

    _defineProperty(this, "closeModal", () => {
      this.setState({
        modalIsOpen: false
      });
    });

    _defineProperty(this, "triggerHiddenTextareaValidation", () => {
      const {
        id
      } = this.props;
      const event = new Event('validate', {
        bubbles: true
      });
      const textarea = document.getElementById(`hidden_textarea_for_${id}`);
      if (!textarea) return;
      textarea.dispatchEvent(event);
    });

    _defineProperty(this, "onEditorChange", value => {
      if (this.props.onEditorChange) {
        this.props.onEditorChange(value);
      }
    });

    _defineProperty(this, "handleEditorChange", (key, {
      value
    }) => {
      const {
        value1,
        value2
      } = this.state;

      if (key === 1) {
        this.setState({
          value1: value
        }, () => this.onEditorChange(value1));
      } else if (key === 2) {
        this.setState({
          value2: value
        }, () => this.onEditorChange(value2));
      }

      this.setState({
        activeEditor: key
      });
    });

    _defineProperty(this, "validateEditor", text => {
      if (text !== '') {
        this.setState({
          isInvalid: false,
          isFocused: true
        });
        this.triggerHiddenTextareaValidation();
      } else {
        this.setState({
          isInvalid: true
        });
      }
    });

    _defineProperty(this, "setClassOfContainer", className => {
      const {
        id
      } = this.props;
      const container = document.getElementById(`${id}_editor_container`);
      container.classList = [className];
    });

    _defineProperty(this, "checkIfNeedsValidation", () => {
      const {
        activeEditor
      } = this.state;
      let text;

      if (activeEditor === 1) {
        text = this.editor1.value.document.text;
      } else if (activeEditor === 2) {
        text = this.editor1.value.document.text;
      }

      if (text && text.length > 0) {
        this.triggerHiddenTextareaValidation();
        this.setClassOfContainer('rte-form-control is-focused');
        setTimeout(() => this.setState({
          isFocused: true
        }), 0);
      }

      this.validateEditor(text);
    });

    _defineProperty(this, "onEditorKeyDown", (event, editor, next) => {
      // eslint-disable-line consistent-return
      if (event.key === 'Tab' && event.shiftKey === true) {
        this.setState({
          isKeyShiftTab: true
        });
      }

      if (this.state.isInvalid) {
        this.checkIfNeedsValidation();
      }

      let mark;

      if (IS_BOLD_HOTKEY(event)) {
        mark = 'bold';
      } else if (IS_ITALIC_HOTKEY(event)) {
        mark = 'italic';
      } else if (IS_UNDERLINED_HOTKEY(event)) {
        mark = 'underlined';
      } else {
        return next();
      }

      event.preventDefault();
      editor.toggleMark(mark);
    });

    _defineProperty(this, "onClick", () => {
      this.setState({
        isFocused: true
      });
    });

    _defineProperty(this, "onContainerFocus", e => {
      if (this.containerRef.current.contains(e.target) && !this.state.isFullScreen) {
        this.setClassOfContainer('rte-form-control is-focused');
      }
    });

    _defineProperty(this, "validateContainer", text => {
      if (text === '') {
        setTimeout(() => this.setState({
          isInvalid: true
        }), 0);
        this.setClassOfContainer('rte-form-control is-invalid');
      } else {
        setTimeout(() => this.setState({
          isInvalid: false
        }), 0);
        this.setClassOfContainer('rte-form-control');
      }
    });

    _defineProperty(this, "onContainerBlur", () => {
      const {
        activeEditor
      } = this.state;
      let text;

      if (activeEditor === 1) {
        text = this.editor1.value.document.text;
      } else if (activeEditor === 2) {
        text = this.editor1.value.document.text;
      }

      const {
        isFullScreen
      } = this.state;
      const {
        id
      } = this.props;
      const textarea = document.getElementById(`hidden_textarea_for_${id}`);
      const event = new Event('validate', {
        bubbles: true
      });

      if (!document.hasFocus()) {
        textarea.removeAttribute('data-no-inline-validation');
        textarea.dispatchEvent(event);
      }

      if (!isFullScreen) {
        if (activeEditor === 1) {
          this.editor1.blur();
        } else if (activeEditor === 2) {
          this.editor2.blur();
        }

        this.validateContainer(text);
        this.triggerHiddenTextareaValidation();
        setTimeout(() => this.setState({
          isFocused: false
        }), 0);
      }
    });

    _defineProperty(this, "handleClickInAndOut", e => {
      const {
        id
      } = this.props;
      const textarea = document.getElementById(`hidden_textarea_for_${id}`);
      const policyModal = document.getElementById('casebook_policy_acceptance_accept_terms_of_use');
      const policyModalActive = document.activeElement === policyModal; // validate editor when clicking inside or outside of the document, but not while the policy acceptance modal is displayed

      if (!policyModalActive) {
        if (this.containerRef.current && !this.containerRef.current.contains(e.target)) {
          textarea.removeAttribute('data-no-inline-validation');
        } else {
          textarea.setAttribute('data-no-inline-validation', 'true');
        }
      }
    });

    _defineProperty(this, "onEditorBlur", (e, editor, next) => {
      const {
        isKeyShiftTab
      } = this.state;

      if (isKeyShiftTab) {
        e.stopPropagation();
        editor.blur();
        next();
      }

      setTimeout(() => this.setState({
        isKeyShiftTab: false
      }), 0);
    });

    _defineProperty(this, "onContainerKeyDown", () => {
      const {
        id
      } = this.props;
      const textarea = document.getElementById(`hidden_textarea_for_${id}`);
      textarea.removeAttribute('data-no-inline-validation');
    });

    this.state = {
      // convert plain text into immutable object that the editor accepts as value
      // we must have different values for each editor instace
      value1: this.props.edit ? Plain.deserialize(this.props.text) : Value.fromJSON(initialValue1),
      value2: this.props.edit ? Plain.deserialize(this.props.text) : Value.fromJSON(initialValue2),
      activeEditor: 1,
      isFocused: false,
      isInvalid: false,
      isFullScreen: false,
      modalIsOpen: false,
      isKeyShiftTab: false
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickInAndOut);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickInAndOut);
  }

  render() {
    const {
      isFocused,
      isInvalid,
      isFullScreen,
      value1,
      value2,
      modalIsOpen,
      activeEditor
    } = this.state;
    const {
      editor1,
      editor2
    } = this;
    const {
      text
    } = activeEditor === 1 ? value1.document : value2.document;
    const {
      id
    } = this.props;
    const activeEl = document.activeElement;
    const rteClass = classNames({
      'rte-form-control is-focused': isFocused,
      'rte-form-control is-invalid': isInvalid,
      'rte-form-control': !isFocused && !isInvalid,
      'rte-form-control full-screen': isFullScreen
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "form-group"
    }, modalIsOpen &&
    /*#__PURE__*/
    // <EditorLinkModal
    //   closeModal={this.closeModal}
    //   hasText={activeEditor === 1 ? editor1.value.selection.isExpanded : editor2.value.selection.isExpanded}
    //   editor={activeEditor === 1 ? editor1 : editor2}
    // />
    React.createElement("div", null, "Editor link modal"), /*#__PURE__*/React.createElement(EditorLabel, this.props), /*#__PURE__*/React.createElement("div", {
      className: "notes",
      id: `wrapper_${id}`
    }, /*#__PURE__*/React.createElement("div", {
      ref: this.containerRef,
      className: rteClass,
      id: `${id}_editor_container`,
      onFocus: this.onContainerFocus,
      onBlur: this.onContainerBlur,
      onClick: this.onClick,
      onKeyDown: this.onContainerKeyDown
    }, /*#__PURE__*/React.createElement(EditorToolbar, {
      value: activeEditor === 1 ? value1 : value2,
      ref: activeEditor === 1 ? this.editor1 : this.editor2,
      passedState: this.state,
      activeEl: activeEl,
      onStateChange: this.handlingStateFromChild
    }), /*#__PURE__*/React.createElement(Editor, {
      id: id,
      className: "rich-text-editor",
      spellCheck: true,
      ref: activeEditor === 1 ? this.ref1 : this.ref2,
      value: activeEditor === 1 ? value1 : value2,
      onChange: e => this.handleEditorChange(activeEditor, e),
      onKeyDown: this.onEditorKeyDown,
      onBlur: this.onEditorBlur,
      onPaste: onLinkPaste,
      renderBlock: renderBlock,
      renderMark: renderMark,
      renderInline: renderInline
    }))), /*#__PURE__*/React.createElement("textarea", {
      className: "rte_hidden_textarea",
      required: true,
      "aria-invalid": isInvalid,
      label: "textarea",
      id: `hidden_textarea_for_${id}`,
      value: text,
      tabIndex: "-1"
    }));
  }

}

LabelledRichTextEditor.propTypes = {
  id: PropTypes.string,
  initialValue: PropTypes.object,
  label: PropTypes.string,
  text: PropTypes.string,
  onEditorChange: PropTypes.func,
  hideLabel: PropTypes.string,
  wrapperTag: PropTypes.string,
  required: PropTypes.bool,
  edit: PropTypes.bool,
  requiredGroup: PropTypes.bool,
  labelClassName: PropTypes.string,
  handleEditorChange: PropTypes.func
};
LabelledRichTextEditor.defaultProps = {
  required: true
};
export default LabelledRichTextEditor;