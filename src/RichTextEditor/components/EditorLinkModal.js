import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal/index';
import { wrapLink } from '../link';

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
    editor
      .insertText(text)
      .moveFocusBackward(text.length)
      .command(wrapLink, url);
  }

  async function saveAndCloseModal() {
    const { editor, hasText, closeModal } = props;
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
    closeModal,
    showHideClassName,
  } = props;
  return /*#__PURE__*/React.createElement(Modal, {
    id: "rte_link_modal",
    title: "Link",
    onClose: closeModal,
    className: 'rte-link-modal',
  }, /*#__PURE__*/React.createElement("div", {
    className: "rte-link-modal-main"
  }, !hasText && /*#__PURE__*/React.createElement("div", {
    className: "form-control"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "rte-link-text",
    className: "label"
  }, "Enter the text of the link"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "rte-link-text",
    className: "form-control",
    name: "rte-link-text",
    value: inputText,
    onChange: updateText
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-control",
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "rte-link-url",
    className: "label"
  }, "Enter the URL of the link. Please include the protocol (e.g. http://, https://, ftp://)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "rte-link-url",
    className: "form-control",
    name: "rte-link-url",
    value: inputUrl,
    onChange: updateUrl
  }))), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer",
  }, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-success btn-outline-success",
    "aria-label": "Save link",
    title: "Save link",
    onClick: saveAndCloseModal
  }, "Save link")));
}

EditorLinkModal.propTypes = {
  closeModal: PropTypes.func,
  hasText: PropTypes.bool,
  editor: PropTypes.object,
};

export default EditorLinkModal;
