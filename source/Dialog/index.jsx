import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import IconSvg from '../IconSvg';

const closeButtonSelector = '[data-dismiss=modal]:not(:disabled)';

class Dialog extends React.Component {
  constructor(props) {
    super(props);
    this.onEscape = this.onEscape.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onModalRef = (ref) => props.modalRef(this._modal = ref);
    this.onBodyRef = (ref) => (this._body = ref);
  }

  componentDidMount() {
    // Record the last focus so we can return users to it on closing
    this._lastFocus = document.activeElement;
    if (!this.props.undismissable && this.props.onClose) {
      document.addEventListener('keydown', this.onEscape);
    }
    // focusin would be better than event delegation, but FF only recently supports this
    document.addEventListener('focus', this.onFocus, true);
    this.focus({ autofocus: true });
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onEscape);
    document.removeEventListener('focus', this.onFocus, true);

    if (this._lastFocus) {
      setTimeout(() => this._lastFocus.focus(), 0);
    }
  }

  onEscape(e) {
    if (!e.defaultPrevented && this.active && (e.key === 'Escape' || e.keyCode === 27)) {
      e.preventDefault();
      this.props.onClose();
    }
  }

  onTab(e) {
    if (e.defaultPrevented || !this.active || (e.key !== 'Tab' && e.keyCode !== 9)) {
      if (this.props.onKeyDown) {
        this.props.onKeyDown(e);
      }
      return;
    }

    const active = document.activeElement;
    const focusable = this.focusable(this._modal);
    let focusOn;
    if (!e.shiftKey && focusable[focusable.length - 1] === active) {
      focusOn = focusable[0];
    } else if (e.shiftKey && focusable[0] === active) {
      focusOn = focusable[focusable.length - 1];
    }
    if (focusOn) {
      e.preventDefault();
      focusOn.focus();
    }
  }

  onFocus() {
    if (!this.active) {
      return;
    }
    const active = document.activeElement;
    if (this._modal !== active && !this._modal.contains(active)) {
      this.focus();
    }
  }

  onCloseButton(e) {
    if (e.defaultPrevented) {
      return;
    }
    if (e.target.matches(`${closeButtonSelector},${closeButtonSelector} *`)) {
      this.props.onClose();
    }
  }

  get active() {
    return this.props.isActive();
  }

  focusable(container) {
    return Array
      .from(container.querySelectorAll('input:not([type=hidden]),textarea,select,button,[tabindex],a[href]'))
      .filter((el) => !el.disabled)
      .filter((el) => el.getClientRects().length); // Visible
  }

  focus({ autofocus = false } = {}) {
    let focusOn = this._modal;
    if (autofocus) {
      this.focusable(this._body).some((el) => (el.autofocus || el.hasAttribute('data-autofocus') ? (focusOn = el) : false));
    }
    focusOn.focus();
  }

  render() {
    const { children, classNameSpace, id, title, onClose, undismissable, className } = this.props;
    const headingClass = this.props.hideTitle ? ' sr-only' : '';
    const modalClasses = classnames(`${classNameSpace}-dialog ${classNameSpace}-dialog-centered`, className);

    return (
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      <div
        className={classNameSpace}
        id={id}
        aria-labelledby={`${id}_title`}
        aria-describedby={`${id}_body`}
        role="alertdialog"
        tabIndex={-1}
        aria-modal="true"
        ref={this.onModalRef}
        onKeyDown={(e) => this.onTab(e)}
        onClick={(e) => this.onCloseButton(e)}
      >
        <div className={modalClasses} role="document">
          <div className={`${classNameSpace}-content`}>
            <div className={`${classNameSpace}-header`}>
              <h1 className={`${classNameSpace}-title${headingClass}`} id={`${id}_title`}>{title}</h1>
              {this.props.actions}
              {!undismissable && (
                <button type="button" className={`${classNameSpace}-close`} onClick={() => onClose()}>
                  {this.props.closeLabel}
                </button>
              )}
            </div>
            <div className={`${classNameSpace}-body`} id={`${id}_body`} ref={this.onBodyRef}>{children}</div>
          </div>
        </div>
      </div>
    );
  }
}

Dialog.propTypes = {
  actions: PropTypes.node,
  children: PropTypes.node.isRequired,
  classNameSpace: PropTypes.string,
  closeLabel: PropTypes.node,
  id: PropTypes.string.isRequired,
  isActive: PropTypes.func,
  modalRef: PropTypes.func,
  onClose: PropTypes.func,
  title: PropTypes.node.isRequired,
  undismissable: PropTypes.bool,
  onKeyDown: PropTypes.func,
  hideTitle: PropTypes.bool,
  className: PropTypes.string,
};

Dialog.defaultProps = {
  classNameSpace: 'modal',
  hideTitle: false,
  closeLabel: <>Close window <IconSvg name="bold" /></>,
  modalRef: () => {},
  isActive: () => false,
  onClose: () => {},
};

export default Dialog;
