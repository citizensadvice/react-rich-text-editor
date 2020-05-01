import React from 'react';
import PropTypes from 'prop-types';

const EditorLabel = ({
  id,
  label,
  required,
  hideLabel,
  wrapperTag,
  requiredGroup,
  labelClassName
}) => {
  const htmlTag = wrapperTag === 'fieldset' ? 'legend' : 'label';
  return React.createElement(htmlTag, {
    className: hideLabel ? 'sr-only' : labelClassName,
    htmlFor: htmlTag === 'label' ? id : null
  }, label, required || requiredGroup ? ' ' : null, required || requiredGroup ? /*#__PURE__*/React.createElement("abbr", {
    title: "required",
    className: "required-marker"
  }, "*") : null);
};

EditorLabel.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  hideLabel: PropTypes.string,
  wrapperTag: PropTypes.string,
  requiredGroup: PropTypes.bool,
  labelClassName: PropTypes.string
};
export default EditorLabel;