/* eslint-disable react/forbid-elements */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import IconSvg from './IconSvg';

import bold from '../assets/bold.svg';
import italic from '../assets/italic.svg';
import underlined from '../assets/underlined.svg';
import numberedList from '../assets/numbered-list.svg';
import bulletList from '../assets/bullet-list.svg';
import paragraphLeft from '../assets/paragraph-left.svg';
import paragraphCentre from '../assets/paragraph-centre.svg';
import paragraphRight from '../assets/paragraph-right.svg';
import indentIncrease from '../assets/indent-increase.svg';
import indentDecrease from '../assets/indent-decrease.svg';
import link from '../assets/link.svg';
import paste from '../assets/paste.svg';
import undo from '../assets/undo.svg';
import redo from '../assets/redo.svg';
import maximise from '../assets/maximise.svg';

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
  maximise,
};


// eslint-disable-next-line arrow-body-style
const EditorToolbarIcon = ({ type, isActive, isDisabled, isLocked, ...props }) => {
  const classes = classNames(
    'rte-format-toolbar_button',
    {
      active: isActive && !isDisabled,
      disabled: isDisabled,
      readonly: isLocked,
    },
  );

  return (
    <IconSvg
      name={type}
      icons={icons}
      className={classes}
      {...props}
    />
  );
};

EditorToolbarIcon.propTypes = {
  type: PropTypes.string,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isLocked: PropTypes.bool,
  onMouseDown: PropTypes.func,
  onKeyDown: PropTypes.func,
  onBlur: PropTypes.func,
};

export default EditorToolbarIcon;
