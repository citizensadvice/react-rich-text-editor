import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { wrapLink } from '../link';
import Modal from '../../Modal';
import Button from '../../Button';
import LabelledInput from '../../LabelledInput';

function EditorLinkModal(props) {
  const [inputUrl, setInputUrl] = useState('');
  const [inputText, setInputText] = useState('');

  function updateUrl(e) {
    setInputUrl(e.target.value);
  }

  function updateText(e) {
    setInputText(e.target.value);
  }

  function makeLink(editor, url) {
    editor.command(wrapLink, url);
  }

  function makeLinkAndInsertText(editor, url, text) {
    editor.insertText(text).moveFocusBackward(text.length).command(wrapLink, url);
  }

  async function saveAndCloseModal() {
    const {
      editor,
      hasText,
      closeModal
    } = props;

    if (hasText) {
      await makeLink(editor, inputUrl);
      closeModal();
    } else if (inputUrl && inputText) {
      await makeLinkAndInsertText(editor, inputUrl, inputText);
      closeModal();
    }
  }

  const {
    hasText,
    closeModal
  } = props;
  return /*#__PURE__*/React.createElement(Modal, {
    id: "rte_link_modal",
    title: "Link",
    onClose: closeModal,
    className: "rte-link-modal"
  }, /*#__PURE__*/React.createElement("div", null, !hasText && /*#__PURE__*/React.createElement(LabelledInput, {
    id: "rte-link-text",
    label: "Enter the text of the link",
    name: "rte-link-text",
    value: inputText,
    onChange: updateText
  }), /*#__PURE__*/React.createElement(LabelledInput, {
    id: "rte-link-url",
    label: "Enter the URL of the link. Please include the protocol (e.g. http://, https://, ftp://)",
    name: "rte-link-url",
    value: inputUrl,
    onChange: updateUrl
  })), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    className: "btn btn-success",
    "aria-label": "Save link",
    title: "Save link",
    onClick: saveAndCloseModal
  }, "Save link"));
}

EditorLinkModal.propTypes = {
  closeModal: PropTypes.func,
  hasText: PropTypes.bool,
  editor: PropTypes.object
};
export default EditorLinkModal;