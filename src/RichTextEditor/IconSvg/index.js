function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
/* eslint-disable import/first */
import React from 'react';
import PropTypes from 'prop-types'; // import './index.scss';
import './index.scss';

const IconSvg = ({
  icons,
  name,
  className,
  ...props
}) => {
  if (!name) return null;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: className
  }, props, {
    tabIndex: "0"
  }), icons && Object.keys(icons).map(title => {
    if (name === title) {
      return (
        /*#__PURE__*/
        // should be button
        React.createElement("img", {
          key: title,
          className: "icon-svg",
          src: icons[title],
          alt: title
        })
      );
    }

    return null;
  }));
};

IconSvg.propTypes = {
  name: PropTypes.string.isRequired,
  icons: PropTypes.object.isRequired,
  className: PropTypes.string
};
export default IconSvg;