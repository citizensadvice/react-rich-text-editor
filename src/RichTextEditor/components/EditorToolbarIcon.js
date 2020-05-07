function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
/* eslint-disable import/first */
/* eslint-disable react/forbid-elements */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import IconSvg from '../IconSvg/index';
import bold from '../assets/images/bold.svg';
import italic from '../assets/images/italic.svg';
import underlined from '../assets/images/underlined.svg';
import numberedList from '../assets/images/numbered-list.svg';
import bulletList from '../assets/images/bullet-list.svg';
import paragraphLeft from '../assets/images/paragraph-left.svg';
import paragraphCentre from '../assets/images/paragraph-centre.svg';
import paragraphRight from '../assets/images/paragraph-right.svg';
import indentIncrease from '../assets/images/indent-increase.svg';
import indentDecrease from '../assets/images/indent-decrease.svg';
import link from '../assets/images/link.svg';
import paste from '../assets/images/paste.svg';
import undo from '../assets/images/undo.svg';
import redo from '../assets/images/redo.svg';
import maximise from '../assets/images/maximise.svg';
const icons = {
  bold,
  italic,
  underlined,
  numberedList,
  bulletList,
  paragraphCentre,
  paragraphLeft,
  paragraphRight,
  indentDecrease,
  indentIncrease,
  link,
  paste,
  undo,
  redo,
  maximise
}; // eslint-disable-next-line arrow-body-style

const EditorToolbarIcon = ({
  type,
  isActive,
  isDisabled,
  ...props
}) => {
  const classes = classNames('rte-format-toolbar_button', {
    active: isActive && !isDisabled,
    disabled: isDisabled
  });
  return /*#__PURE__*/React.createElement(IconSvg, _extends({
    name: type,
    icons: icons,
    className: classes
  }, props));
};

EditorToolbarIcon.propTypes = {
  type: PropTypes.string,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onMouseDown: PropTypes.func,
  onKeyDown: PropTypes.func,
  onBlur: PropTypes.func
};
export default EditorToolbarIcon;