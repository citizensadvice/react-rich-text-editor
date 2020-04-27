import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { startCase } from 'lodash-es';

import { DEFAULT_NODE, FORM_GROUP_COLLECTION, RTE_FORM_CTRL_COLLECTION, RTE_COLLECTION } from '../constants';
import { hasBlock, hasMark } from '../utils';
import { unwrapLink, hasLinks } from '../link';

import EditorToolbarIcon from './EditorToolbarIcon.jsx';
import EditorToolbarInfobox from './EditorToolbarInfobox';
import OutsideAlerter from './OutsideAlerter';

const EditorToolbar = React.forwardRef((props, ref) => {
  const {
    value,
    passedState,
    onStateChange,
  } = props;

  const editorRef = ref;
  const [isPasteInfoActive, setIsPasteInfoActive] = useState(false);
  const [isShiftTab, setIsShiftTab] = useState(false);

  function onClickMark(event, type, editor) {
    event.preventDefault();
    if (!editor) return;
    editor.toggleMark(type);
  }

  function onMarkKeyDown(event, type, editor) {
    if (event.key === 'Enter') {
      event.preventDefault();
      onClickMark(event, type, editor);
    } else if (event.key === 'Tab' && event.shiftKey === true && type === 'bold') {
      setIsShiftTab(true);
    }
  }

  function onBlur(e) {
    if (!isShiftTab) {
      e.stopPropagation();
    }
  }

  function renderMarkButton(type) {
    const isActive = hasMark(type, value);
    return (
      <EditorToolbarIcon
        key={type}
        type={type}
        title={startCase(type)}
        isActive={isActive}
        onMouseDown={(event) => onClickMark(event, type, editorRef)}
        onKeyDown={(event) => onMarkKeyDown(event, type, editorRef)}
        onBlur={(e) => onBlur(e)}
      />
    );
  }

  function activateFullScreen(field) {
    document.body.classList.add('overflow-hidden');
    field.classList.add('full-screen');
    onStateChange({ isFullScreen: true });
  }

  function deactivateFullScreen(field) {
    document.body.classList.remove('overflow-hidden');
    field.classList.remove('full-screen');
    onStateChange({ isFullScreen: false });
  }

  function onClickBlock(event, type, editor) {
    if (event) event.preventDefault();
    const { document } = value;
    const { isFullScreen } = passedState;
    const { activeEl } = props;

    if (type === 'paste') {
      setIsPasteInfoActive(!isPasteInfoActive);
      return;
    }

    if (type === 'undo') {
      editor.undo();
      return;
    }
    if (type === 'redo') {
      editor.redo();
      return;
    }

    if (type === 'maximise') {
      const fieldArr = [FORM_GROUP_COLLECTION, RTE_FORM_CTRL_COLLECTION, RTE_COLLECTION]
        .map((collection) => Array.from(collection));
      if (fieldArr) {
        let fields = [];
        const notesArr = fieldArr[0];
        const containersArr = fieldArr[1];
        const editorsArr = fieldArr[2];

        const containerEl = containersArr.find((el) => el.id.includes(activeEl.id));
        const wrapperEl = notesArr.find((el) => el.id.includes(activeEl.id));
        const editorEl = editorsArr.find((el) => el === activeEl);

        fields = fields
          .concat(containerEl)
          .concat(wrapperEl)
          .concat(editorEl);

        if (fields) {
          fields.forEach((field) => {
            activateFullScreen(field);
            if (isFullScreen) {
              deactivateFullScreen(field);
            }
          });
        }
      }
      return;
    }

    // Handle everything but list buttons.
    if (type !== 'bulletList' && type !== 'numberedList') {
      const isActive = hasBlock(type, value);
      const isList = hasBlock('list-item', value);
      if (editor) {
        if (isList) {
          editor
            .setBlocks(isActive ? DEFAULT_NODE : type)
            .unwrapBlock('bulletList')
            .unwrapBlock('numberedList');
        } else {
          editor.setBlocks(isActive ? DEFAULT_NODE : type);
        }
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = hasBlock('list-item', value);
      const isType = value.blocks.some((block) => !!document.getClosest(block.key, (parent) => parent.type === type));

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulletList')
          .unwrapBlock('numberedList');
      } else if (isList) {
        editor
          .unwrapBlock(
            type === 'bulletList' ? 'numberedList' : 'bulletList',
          )
          .wrapBlock(type);
      } else {
        if (!editor) return;
        editor.setBlocks('list-item').wrapBlock(type);
      }
    }
  }

  function openModal() {
    onStateChange({ modalIsOpen: true });
  }

  function onClickLink() {
    const textHasLink = hasLinks(value);

    if (textHasLink) {
      editorRef.command(unwrapLink);
      return;
    }
    openModal();
  }

  function onButtonMouseDown(event, type) {
    if (type !== 'paste') {
      event.stopPropagation();
    }
    if (type === 'link') {
      onClickLink(event, editorRef);
      return;
    }
    onClickBlock(event, type, editorRef);
  }

  function onButtonKeyDown(event, type) {
    event.stopPropagation();
    // Space key
    if (event.keyCode === 32) {
      event.preventDefault();
      onButtonMouseDown(event, type);
    }
  }

  function disableIcon(type, editorValue) {
    const undos = editorValue.data.get('undos');
    const redos = editorValue.data.get('redos');
    const undoCount = undos ? undos.size : 0;
    const redoCount = redos ? redos.size : 0;

    switch (type) {
      case 'indentDecrease':
        return !hasBlock('indentIncrease', value);
      case 'undo':
        return undoCount <= 1;
      case 'redo':
        return redoCount < 1;
      default:
        return false;
    }
  }

  function renderBlockButton(type) {
    let isActive = hasBlock(type, value);

    if (['numberedList', 'bulletList'].includes(type)) {
      const { value: { document, blocks } } = props;

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key);
        isActive = hasBlock('list-item', value) && parent && parent.type === type;
      }
    }

    if (type === 'link') {
      isActive = hasLinks(value);
    }

    return (
      <div key={type}>
        <EditorToolbarIcon
          isActive={isActive}
          isDisabled={disableIcon(type, value)}
          type={type}
          title={startCase(type)}
          onMouseDown={(event) => onButtonMouseDown(event, type)}
          onKeyDown={(event) => onButtonKeyDown(event, type)}
          onBlur={(e) => e.stopPropagation()}
        />
        {isPasteInfoActive && type === 'paste' && (
          <OutsideAlerter
            action={(event) => onButtonMouseDown(event, type)}
            actionKeys={[]}
          >
            <EditorToolbarInfobox>
              Please press <span className="rte-format-toolbar_category-key">ctrl+V</span>
              {' '} or <span className="rte-format-toolbar_category-key">⌘+V</span> to paste.
              Your browser does not support pasting with the toolbar button or context menu option.
            </EditorToolbarInfobox>
          </OutsideAlerter>
        )}
      </div>
    );
  }

  function onToolbarContainerClick(e) {
    e.stopPropagation();
    if (!editorRef) return;
    editorRef.focus();
  }

  return (
    <div className="rte-format-toolbar_container" id="container" onClick={onToolbarContainerClick}>
      <div className="rte-format-toolbar">
        <div className="rte-format-toolbar_category">
          {renderMarkButton('bold')}
          {renderMarkButton('italic')}
          {renderMarkButton('underlined')}
        </div>

        <div className="rte-format-toolbar_category">
          {renderBlockButton('numberedList')}
          {renderBlockButton('bulletList')}
          {renderBlockButton('indentDecrease')}
          {renderBlockButton('indentIncrease')}
        </div>

        <div className="rte-format-toolbar_category">
          {renderBlockButton('paragraphLeft')}
          {renderBlockButton('paragraphCentre')}
          {renderBlockButton('paragraphRight')}
        </div>

        <div className="rte-format-toolbar_category">
          {renderBlockButton('link')}
        </div>

        <div className="rte-format-toolbar_category">
          {renderBlockButton('paste')}
        </div>

        <div className="rte-format-toolbar_category">
          {renderBlockButton('undo')}
          {renderBlockButton('redo')}
        </div>

        <div className="rte-format-toolbar_category">
          {renderBlockButton('maximise')}
        </div>
      </div>
    </div>
  );
});


EditorToolbar.propTypes = {
  value: PropTypes.object,
  activeEl: PropTypes.instanceOf(Element),
  passedState: PropTypes.object,
  onStateChange: PropTypes.func,
};

// The forwardRef generates an anonymous function,
// so it can't take the name from the variable definition
EditorToolbar.displayName = 'EditorToolbar';

export default EditorToolbar;
