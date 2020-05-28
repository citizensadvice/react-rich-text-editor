import React from 'react';
import ReactDOM from 'react-dom';
import modalContainer from './modal_container';
import Dialog from '../Dialog';

class Modal extends React.Component {
  UNSAFE_componentWillMount() {
    // TODO: remove lifecycle method and use the constructor instead or do the appropriate refactoring
    this.container = modalContainer.add(this);
  }

  componentWillUnmount() {
    modalContainer.delete(this);
  }

  isActive() {
    return modalContainer.isActive(this);
  }

  render() {
    return ReactDOM.createPortal(<Dialog {...this.props} isActive={() => this.isActive()} />, this.container);
  }
}

export default Modal;
