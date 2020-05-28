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
    const { edit, text, readOnly } = this.props;
    this.containerRef = React.createRef();
    this.editor = React.createRef();

    this.state = {
      editorValue: edit ? Plain.deserialize(text) : Value.fromJSON(initialValue),
      readOnly,
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

  handleCloseModal = () => {
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

  handleContainerBlur = () => {
    const { isFullScreen } = this.state;
    if (!isFullScreen) this.editor.blur();
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
    const { editorValue, isFullScreen, modalIsOpen, readOnly } = this.state;
    const { editor } = this;
    const activeEl = document.activeElement;

    const stateClasses = classNames({
      'is-fullscreen': isFullScreen,
    });

    return (
      <div className={`form-group ${stateClasses}`}>
        {modalIsOpen && (
          <EditorLinkModal
            closeModal={this.handleCloseModal}
            hasText={editor.value.selection.isExpanded}
            editor={editor}
          />
        )}

        <div className="wrapper-editor" id={`wrapper_${id}`}>
          <div
            ref={this.containerRef}
            id={`${id}_editor_container`}
            className="rte-form-control"
            onBlur={this.handleContainerBlur}
          >
            {!!events && events}

            <EditorToolbar
              value={editorValue}
              ref={editor}
              passedState={this.state}
              isLocked={readOnly}
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
              readOnly={readOnly}
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
  readOnly: PropTypes.bool,
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
  readOnly: false,
};

export default LabelledRichTextEditor;