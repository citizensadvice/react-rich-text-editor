// useNativeValidation:
// offers the possibility to use the native validation rather than the consumer custom validation
// if required is true

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Editor } from 'slate-react';
import Plain from 'slate-plain-serializer';
import Html from 'slate-html-serializer';

import { Value } from 'slate';
import { IS_BOLD_HOTKEY, IS_ITALIC_HOTKEY, IS_UNDERLINED_HOTKEY } from './constants';
import { onLinkPaste, renderInline } from './link';
import { renderMark, renderBlock, rules, deserialize } from './utils';
import initialValue from './value.json';

// import EditorLinkModal from './components/EditorLinkModal';
import EditorLabel from './components/EditorLabel';
import EditorToolbar from './components/EditorToolbar';
// import LabelledTextarea from '../LabelledTextarea';
import './index.scss';


// retrieve content from the local storage or a default
const localStorageContent = localStorage.getItem('content') || '<p><p/>';
const html = new Html({ rules });

const initialValue1 = Value.fromJSON(initialValue);
const initialValue2 = Value.fromJSON(initialValue);

class LabelledRichTextEditor extends React.Component {
  containerRef = React.createRef();
  editor1 = React.createRef();
  editor2 = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      // convert plain text into immutable object that the editor accepts as value
      // we must have different values for each editor instace
      value1: this.props.edit ? Plain.deserialize(this.props.text) : Value.fromJSON(initialValue1),
      value2: this.props.edit ? Plain.deserialize(this.props.text) : Value.fromJSON(initialValue2),
      value: this.getValue(),
      lockedForm: this.props.lockedForm,
      activeEditor: 1,
      isFocused: false,
      isInvalid: false,
      isFullScreen: false,
      modalIsOpen: false,
      isKeyShiftTab: false,
    };
  }

  componentDidMount() {
    console.log('value received', this.state.value.document.text);
  }

  convertHtmlToString = (content) => {
    // convert string into html format
    const document = new DOMParser().parseFromString(content, 'text/html');
    // get only string content from that html
    return deserialize(document.body);
  }

  getValue = () => {
    const { edit, summaryText } = this.props;
    // console.log(summaryText);
    const localStorageContentAsString = this.convertHtmlToString(localStorageContent);
    // convert text to value
    const summaryTextAsValue = html.deserialize(summaryText);
    const localStorageAsValue = html.deserialize(localStorageContent);

    if (edit) {
      // check if the local storage content is for the correct editor
      if (localStorageContentAsString === summaryText) {
        return html.deserialize(localStorageContent);
      } return html.deserialize(summaryText);
    } return Value.fromJSON(initialValue);
  }

  ref1 = (editor1) => {
    this.editor1 = editor1;
  }

  ref2 = (editor2) => {
    this.editor2 = editor2;
  }

  handlingStateFromChild = (newState) => {
    this.setState(newState);
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  }

  onEditorChange = (value) => {
    if (this.props.onEditorChange) {
      this.props.onEditorChange(value);
    }
  }

  handleEditorChange = (key, { value }) => {
    const { value1, value2 } = this.state;
    let content;

    if (key === 1) {
      this.setState({ value1: value }, () => this.onEditorChange(value1));
      content = html.serialize(value1);
    } else if (key === 2) {
      this.setState({ value2: value }, () => this.onEditorChange(value2));
      content = html.serialize(value2);
    } this.setState({ activeEditor: key });

    localStorage.setItem('content', content);
  }

  validateEditor = (text) => {
    if (text !== '') {
      this.setState({ isInvalid: false, isFocused: true });
    } else {
      this.setState({ isInvalid: true });
    }
  }

  setClassOfContainer = (className) => {
    const { id } = this.props;
    const container = document.getElementById(`${id}_editor_container`);
    container.classList = [className];
  }

  checkIfNeedsValidation = () => {
    const { activeEditor } = this.state;
    let text;
    if (activeEditor === 1) {
      text = this.editor1.value.document.text;
    } else if (activeEditor === 2) {
      text = this.editor1.value.document.text;
    }

    if (text && text.length > 0) {
      this.setClassOfContainer('rte-form-control is-focused');
      setTimeout(() => this.setState({ isFocused: true }), 0);
    }
    this.validateEditor(text);
  }


  onEditorKeyDown = (event, editor, next) => { // eslint-disable-line consistent-return
    if (event.key === 'Tab' && event.shiftKey === true) {
      this.setState({ isKeyShiftTab: true });
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
  }

  onClick = () => {
    if (this.state.lockedForm) return;
    this.setState({ isFocused: true });
  }

  onContainerFocus = (e) => {
    if (this.containerRef.current.contains(e.target) && !this.state.isFullScreen) {
      this.setClassOfContainer('rte-form-control is-focused');
    }
  }

  validateContainer = (text) => {
    if (text === '') {
      setTimeout(() => this.setState({ isInvalid: true }), 0);
      this.setClassOfContainer('rte-form-control is-invalid');
    } else {
      setTimeout(() => this.setState({ isInvalid: false }), 0);
      this.setClassOfContainer('rte-form-control');
    }
  }

  onContainerBlur = () => {
    const { activeEditor } = this.state;
    let text;
    if (activeEditor === 1) {
      text = this.editor1.value.document.text;
    } else if (activeEditor === 2) {
      text = this.editor1.value.document.text;
    }
    const { isFullScreen } = this.state;
    const { required, useNativeValidation } = this.props;

    if (!isFullScreen) {
      if (activeEditor === 1) {
        this.editor1.blur();
      } else if (activeEditor === 2) {
        this.editor2.blur();
      }
      if (required && useNativeValidation) {
        this.validateContainer(text);
      }
      setTimeout(() => this.setState({ isFocused: false }), 0);
    }
  }

  onEditorBlur = (e, editor, next) => {
    const { isKeyShiftTab } = this.state;

    if (isKeyShiftTab) {
      e.stopPropagation();
      editor.blur();
      next();
    }
    setTimeout(() => this.setState({ isKeyShiftTab: false }), 0);
  }

  render() {
    const { isFocused, isInvalid, isFullScreen,
      value1, value2, modalIsOpen, activeEditor, lockedForm } = this.state;
    const { editor1, editor2 } = this;
    // const { text } = activeEditor === 1 ? value1.document : value2.document;
    const { id, events, required, label, useNativeValidation, customErrorMsg } = this.props;
    const activeEl = document.activeElement;
    const showValidation = isInvalid && required && useNativeValidation;
    const rteClass = classNames({
      'rte-form-control is-focused': isFocused,
      'rte-form-control is-invalid': showValidation,
      'rte-form-control': !isFocused && !showValidation,
      'rte-form-control full-screen': isFullScreen,
    });
    return (
      <div className="form-group">
        {modalIsOpen && (
          // <EditorLinkModal
          //   closeModal={this.closeModal}
          //   hasText={activeEditor === 1 ? editor1.value.selection.isExpanded : editor2.value.selection.isExpanded}
          //   editor={activeEditor === 1 ? editor1 : editor2}
          // />
          <div>Editor link modal</div>
        )}

        <EditorLabel {...this.props} />

        {/* change classname from notes to something more suggestive */}
        <div className="notes" id={`wrapper_${id}`}>
          <div
            ref={this.containerRef}
            className={rteClass}
            id={`${id}_editor_container`}
            onFocus={this.onContainerFocus}
            onBlur={this.onContainerBlur}
            onClick={this.onClick}
          >
            {!!events && events}
            <EditorToolbar
              value={activeEditor === 1 ? value1 : value2}
              ref={activeEditor === 1 ? editor1 : editor2}
              passedState={this.state}
              isLocked={lockedForm}
              activeEl={activeEl}
              onStateChange={this.handlingStateFromChild}
            />
            <Editor
              id={id}
              className="rich-text-editor"
              spellCheck
              contentEditable="true"
              role="textbox"
              aria-labelledby={label}
              aria-describedby={`${id}_error`}
              aria-invalid={isInvalid}
              readOnly={lockedForm}
              ref={activeEditor === 1 ? this.ref1 : this.ref2}
              value={activeEditor === 1 ? value1 : value2}
              onChange={(e) => this.handleEditorChange(activeEditor, e)}
              onKeyDown={this.onEditorKeyDown}
              onBlur={this.onEditorBlur}
              onPaste={onLinkPaste}
              renderBlock={renderBlock}
              renderMark={renderMark}
              renderInline={renderInline}
            />
          </div>
        </div>
        {showValidation && (
        <span id={`${id}_error`} className="form-control-invalid">
          {customErrorMsg}
        </span>
        )}
      </div>
    );
  }
}

LabelledRichTextEditor.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  customErrorMsg: PropTypes.string,
  text: PropTypes.string,
  lockedForm: PropTypes.bool,
  onEditorChange: PropTypes.func,
  hideLabel: PropTypes.string,
  wrapperTag: PropTypes.string,
  required: PropTypes.bool,
  useNativeValidation: PropTypes.bool,
  edit: PropTypes.bool,
  requiredGroup: PropTypes.bool,
  labelClassName: PropTypes.string,
  handleEditorChange: PropTypes.func,
  events: PropTypes.node,
};

LabelledRichTextEditor.defaultProps = {
  id: 'editor',
  required: false,
  lockedForm: false,
  customErrorMsg: 'Please complete this field',
};

export default LabelledRichTextEditor;
