import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { wrapLink } from '../link';
import Modal from '../../src/RichTextEditor/Modal';

function EditorLinkModal(props) {
  const ref = useRef();

  const [inputUrl, setInputUrl] = useState('');
  const [inputText, setInputText] = useState('');
  const [invalidText, setInvalidText] = useState(false);
  const [invalidUrl, setInvalidUrl] = useState(false);
  const [invalidForm, setInvalidForm] = useState(false);

  // The submit logic for the form
  useEffect(() => {
    const { form } = ref.current;
    const formIsValid = form.checkValidity();
    const handleFormSubmit = (e) => {
      if (!formIsValid) {
        e.preventDefault();
        setInvalidForm(true);
      }
    };
    form.addEventListener('submit', handleFormSubmit);
    return () => {
      form.removeEventListener('submit', handleFormSubmit);
    };
  }, [invalidText, invalidUrl]);

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

  async function saveAndCloseModal(e) {
    const { editor, hasText, closeModal } = props;
    if (hasText) {
      await makeLink(editor, inputUrl);
      closeModal();
    } else if (inputUrl && inputText) {
      await makeLinkAndInsertText(editor, inputUrl, inputText);
      closeModal();
    }
  }

  const handleTextFieldBlur = (e) => {
    if (!e.target.value) {
      setInvalidText(true);
    } else setInvalidText(false);
  };

  const handleUrlFieldBlur = (e) => {
    if (!e.target.value) {
      setInvalidUrl(true);
    } else setInvalidUrl(false);
  };

  const { hasText, closeModal } = props;

  return (
    <Modal
      id="rte_link_modal"
      title="Link"
      onClose={closeModal}
      className="rte-link-modal"
    >
      <form noValidate>
        {invalidForm && (
          <p className="text-danger">Please complete all fields before saving</p>
        )}
        <div className="rte-link-modal-main">
          {!hasText && (
            <div className="form-group">
              <label
                id="rte-link-text-label"
                htmlFor="rte-link-text"
                className="label"
              >
                Enter the text of the link
              </label>
              <input
                type="text"
                id="rte-link-text"
                className="form-control"
                name="rte-link-text"
                value={inputText}
                onChange={updateText}
                onBlur={handleTextFieldBlur}
                required
                aria-labelledby="rte-link-text-label"
                aria-describedby="rte-link-text_error"
                aria-invalid={invalidText}
              />
              {invalidText && (
              <span id="rte-link-text_error" className="form-control-invalid">
                Please complete this field
              </span>
              )}
            </div>
          )}
          <div className="form-group">
            <label
              id="rte-link-url-label"
              htmlFor="rte-link-url"
              className="label"
            >
              Enter the URL of the link. Please include the protocol (e.g. http://, https://, ftp://)
            </label>
            <input
              type="text"
              id="rte-link-url"
              className="form-control"
              name="rte-link-url"
              value={inputUrl}
              onChange={updateUrl}
              onBlur={handleUrlFieldBlur}
              required
              aria-labelledby="rte-link-url-label"
              aria-describedby="rte-link-url_error"
              aria-invalid={invalidUrl}
            />
            {invalidUrl && (
              <span id="rte-link-url_error" className="form-control-invalid">
                Please complete this field
              </span>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="submit"
            className="btn btn btn-outline-success"
            aria-label="Save link"
            title="Save link"
            onClick={saveAndCloseModal}
            ref={ref}
          >
            Save link
          </button>
        </div>
      </form>
    </Modal>
  );
}

EditorLinkModal.propTypes = {
  closeModal: PropTypes.func,
  hasText: PropTypes.bool,
  editor: PropTypes.object,
};

export default EditorLinkModal;
