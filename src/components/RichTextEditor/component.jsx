import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Value } from 'slate';
import { Editor } from 'slate-react';
import Plain from 'slate-plain-serializer';
import Html from 'slate-html-serializer';

import { IS_BOLD_HOTKEY, IS_ITALIC_HOTKEY, IS_UNDERLINED_HOTKEY } from './constants';
import { onPaste, renderInline } from './link';
import { renderMark, renderBlock, rules } from './utils';
import initialValue from './value.json';

import EditorToolbar from './components/EditorToolbar';
import EditorLinkModal from './components/EditorLinkModal/EditorLinkModal';

const html = new Html({ rules });

class LabelledRichTextEditor extends React.Component {
  constructor(props) {
    super(props);
    const { edit, text, lockedForm } = this.props;
    this.containerRef = React.createRef();
    this.editor = React.createRef();

    this.state = {
      editorValue: edit ? Plain.deserialize(text) : Value.fromJSON(initialValue),
      lockedForm,
      isFocused: false,
      isFullScreen: false,
      modalIsOpen: false,
      isKeyShiftTab: false,
    };
  }

  ref = (editor) => {
    this.editor = editor;
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

  handleEditorChange = ({ value }) => {
    const { editorValue } = this.state;

    this.setState(
      { editorValue: value },
      () => this.onEditorChange(html.serialize(editorValue)),
    );
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
    const { isFullScreen } = this.state;
    if (this.containerRef.current.contains(e.target) && !isFullScreen) {
      this.setClassOfContainer('rte-form-control is-focused');
    }
  }

  onContainerBlur = () => {
    const { isFullScreen } = this.state;

    if (!isFullScreen) {
      this.editor.blur();
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
    const { isInvalid, id, events, labelledby } = this.props;
    const { editorValue, isFocused, isFullScreen, modalIsOpen, lockedForm } = this.state;
    const { editor } = this;
    const activeEl = document.activeElement;

    const rteClass = classNames({
      'is-focused': isFocused,
      'full-screen': isFullScreen,
    });

    return (
      <div className="form-group">
        {modalIsOpen && (
          <EditorLinkModal
            closeModal={this.closeModal}
            hasText={editor.value.selection.isExpanded}
            editor={editor}
          />
        )}

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
              value={editorValue}
              ref={editor}
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
              aria-labelledby={labelledby}
              aria-describedby={`${id}_error`}
              aria-invalid={isInvalid}
              readOnly={lockedForm}
              ref={this.ref}
              value={editorValue}
              onChange={this.handleEditorChange}
              onKeyDown={this.onEditorKeyDown}
              onBlur={this.onEditorBlur}
              onPaste={onPaste}
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
  text: PropTypes.string,
  labelledby: PropTypes.string,
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
};

export default LabelledRichTextEditor;
