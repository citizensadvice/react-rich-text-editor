function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
/* eslint-disable import/first */
import React from 'react';
import PropTypes from 'prop-types';
const safeHost = /(^|\.)citizensadvice\.org\.uk$/;
const location = window.location;

function LinkNewWindow({
  children,
  href,
  ...rest
}) {
  const rel = ['noopener'];
  const urlObject = new URL(href, location.href);

  if (new URL(location.href).origin !== urlObject.origin) {
    rel.push('external');

    if (!safeHost.test(urlObject.hostname)) {
      rel.push('noreferrer');
    }
  }

  return (
    /*#__PURE__*/
    // eslint-disable-next-line react/jsx-no-target-blank
    React.createElement("a", _extends({
      href: href,
      rel: rel.join(' '),
      target: "_blank"
    }, rest), children || href, /*#__PURE__*/React.createElement("span", {
      className: "sr-only"
    }, " (new window)"))
  );
}

LinkNewWindow.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string.isRequired
};
export default LinkNewWindow;