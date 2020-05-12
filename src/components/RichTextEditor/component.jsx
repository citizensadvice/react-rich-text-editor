import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Value } from 'slate';
import { Editor } from 'slate-react';
import Plain from 'slate-plain-serializer';
import Html from 'slate-html-serializer';

import { IS_BOLD_HOTKEY, IS_ITALIC_HOTKEY, IS_UNDERLINED_HOTKEY } from './constants';
import { onLinkPaste, renderInline } from './link';
import { renderMark, renderBlock, rules } from './utils';
import initialValue from './value.json';

import EditorLabel from './components/EditorLabel';
import EditorToolbar from './components/EditorToolbar';

const html = new Html({ rules });

const initialValue1 = Value.fromJSON(initialValue);
const initialValue2 = Value.fromJSON(initialValue);

class LabelledRichTextEditor extends React.Component {
  containerRef = React.createRef();

  editor1 = React.createRef();

  editor2 = React.createRef();

  constructor(props) {
    super(props);
    const { edit, text, lockedForm } = this.props;

    this.state = {
      value1: edit ? Plain.deserialize(text) : Value.fromJSON(initialValue1),
      value2: edit ? Plain.deserialize(text) : Value.fromJSON(initialValue2),
      lockedForm,
      activeEditor: 1,
      isFocused: false,
      isFullScreen: false,
      modalIsOpen: false,
      isKeyShiftTab: false,
    };
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
    const { onEditorChange } = this.props;
    if (onEditorChange) onEditorChange(value);
  }

  handleEditorChange = (key, { value }) => {
    const { value1, value2 } = this.state;

    if (key === 1) {
      this.setState({ value1: value }, () => this.onEditorChange(html.serialize(value1)));
    } else if (key === 2) {
      this.setState({ value2: value }, () => this.onEditorChange(html.serialize(value2)));
    } this.setState({ activeEditor: key });
  }

  setClassOfContainer = (className) => {
    const { id } = this.props;
    const container = document.getElementById(`${id}_editor_container`);
    container.classList = [className];
  }

  onEditorKeyDown = (event, editor, next) => { // eslint-disable-line consistent-return
    if (event.key === 'Tab' && event.shiftKey === true) {
      this.setState({ isKeyShiftTab: true });
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
    const { lockedForm } = this.state;
    if (lockedForm) return;
    this.setState({ isFocused: true });
  }

  onContainerFocus = (e) => {
    if (
      this.containerRef.current.contains(e.target)
      && !this.state.isFullScreen
    ) {
      this.setClassOfContainer('rte-form-control is-focused');
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

    if (!isFullScreen) {
      if (activeEditor === 1) {
        this.editor1.blur();
      } else if (activeEditor === 2) {
        this.editor2.blur();
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
    const {
      isInvalid, id, events, label,
    } = this.props;

    const {
      value1, value2, isFocused, isFullScreen, modalIsOpen, activeEditor, lockedForm,
    } = this.state;

    const { editor1, editor2 } = this;
    const activeEl = document.activeElement;

    const rteClass = classNames({
      'is-focused': isFocused,
      'full-screen': isFullScreen,
    });

    return (
      <div className="form-group">
        {modalIsOpen && <div>Editor link modal</div>}

        <EditorLabel {...this.props} />

        <div className="notes" id={`wrapper_${id}`}>
          <div
            ref={this.containerRef}
            className={`rte-form-control ${rteClass}`}
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
      </div>
    );
  }
}

LabelledRichTextEditor.propTypes = {
  isInvalid: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string,
  customErrorMsg: PropTypes.string,
  text: PropTypes.string,
  lockedForm: PropTypes.bool,
  onEditorChange: PropTypes.func,
  hideLabel: PropTypes.string,
  wrapperTag: PropTypes.string,
  required: PropTypes.bool,
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
