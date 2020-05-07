import React from 'react';
import PropTypes from 'prop-types';

const safeHost = /(^|\.)citizensadvice\.org\.uk$/;

const location = window.location;

function LinkNewWindow({ children, href, ...rest }) {
  const rel = ['noopener'];
  const urlObject = new URL(href, location.href);
  if (new URL(location.href).origin !== urlObject.origin) {
    rel.push('external');
    if (!safeHost.test(urlObject.hostname)) {
      rel.push('noreferrer');
    }
  }

  return (
    // eslint-disable-next-line react/jsx-no-target-blank
    <a href={href} rel={rel.join(' ')} target="_blank" {...rest}>
      {children || href}
      <span className="sr-only"> (new window)</span>
    </a>
  );
}

LinkNewWindow.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string.isRequired,
};

export default LinkNewWindow;
