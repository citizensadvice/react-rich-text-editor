import React from 'react';
import PropTypes from 'prop-types';

const EditorLabel = ({
  id,
  label,
  required,
  hideLabel,
  wrapperTag,
  requiredGroup,
  labelClassName,
}) => {
  const htmlTag = wrapperTag === 'fieldset' ? 'legend' : 'label';

  return React.createElement(
    htmlTag,
    {
      htmlFor: htmlTag === 'label' ? id : null,
      className: hideLabel ? 'sr-only' : labelClassName,
    },
    label,
    required || requiredGroup ? ' ' : null,
    required || requiredGroup ? <abbr title="required" className="required-marker">*</abbr> : null,
  );
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
