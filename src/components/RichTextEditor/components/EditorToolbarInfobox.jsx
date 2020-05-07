import React from 'react';
import PropTypes from 'prop-types';

const EditorToolbarInfobox = ({ children }) => {
  return (
    <div className="rte-format-toolbar_category-info">
      {children}
    </div>
  );
}

EditorToolbarInfobox.propTypes = {
  children: PropTypes.node,
};

export default EditorToolbarInfobox;
