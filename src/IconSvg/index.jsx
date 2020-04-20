import React from 'react';
import PropTypes from 'prop-types';

const IconSvg = ({ icons, name, className, ...props }) => {
  if (!name) return null;
  return (
    <div className={className} {...props} tabIndex="0">
      {icons && Object.keys(icons).map((title) => {
        if (name === title) {
          return (
            <img key={title} className="icon-svg" src={icons[title]} alt={title} />
          );
        } return null;
      })}
    </div>
  );
};

IconSvg.propTypes = {
  name: PropTypes.string.isRequired,
  icons: PropTypes.object.isRequired,
  className: PropTypes.string,
};

export default IconSvg;
