function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
/* eslint-disable import/first */
import React from 'react';
import PropTypes from 'prop-types';
/**
 * A React component to capture click events that happen outside
 * of it's children.
 *
 * @param { action } function - function with which to invoke after events.
 * @param { actionKeys } array - of keys that when pressed will invoke the `action`.
 *
 * Example usages:
 *
 * <OutsideAlerter action={() => {}} actionKeys={['27']}>
 *     // action fires ONLY on key press of key with code 27.
 * </OutsideAlerter>
 *
 * <OutsideAlerter action={() => {}} actionKeys={[]}>
 *     // action fires on ALL key presses.
 * </OutsideAlerter>
 *
 * <OutsideAlerter action={() => {}}>
 *     // action won't fire on any key presses.
 * </OutsideAlerter>
 *
 * TODO:
 * Allow for a sequence of keys to be pressed, for example CMD+V.
 */

class OutsideAlerter extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "container", React.createRef());

    _defineProperty(this, "handleClickOutside", e => {
      if (this.container.current && !this.container.current.contains(e.target)) {
        this.props.action();
      }
    });

    _defineProperty(this, "handleKeyDown", (e, keys) => {
      const selectedKey = e.which; // if the key exists in the array, act upon it.

      if (keys.indexOf(selectedKey) !== -1) {
        this.handleClickOutside(e);
      }
    });
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);

    if (this.props.actionKeys) {
      // if an array of numbers was passed, then these are the keys with which to act upon.
      if (this.props.actionKeys.length > 0) {
        document.addEventListener('keydown', e => this.handleKeyDown(e, this.props.actionKeys)); // if an empty array was provided, we act on ALL key presses.
      } else {
        document.addEventListener('keydown', this.handleClickOutside);
      }
    }
  }

  componentWillUnmount() {
    // clean up.
    document.removeEventListener('mousedown', this.handleClickOutside);
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      ref: this.container
    }, this.props.children);
  }

}

OutsideAlerter.propTypes = {
  children: PropTypes.node.isRequired,
  action: PropTypes.func.isRequired,
  actionKeys: PropTypes.arrayOf(PropTypes.number)
};
export default OutsideAlerter;