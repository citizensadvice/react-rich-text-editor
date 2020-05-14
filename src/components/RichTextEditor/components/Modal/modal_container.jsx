export default {
  modals: new Map(),
  _mask: null,

  get mask() {
    if (!this._mask) {
      this._mask = document.createElement('div');
      this._mask.className = 'modal-backdrop fade show';
      this._mask.style.zIndex = 1050;
    }
    return this._mask;
  },

  setMask() {
    // TODO: Map iterators are broken in IE11 https://github.com/Financial-Times/polyfill-service/issues/1409
    const modals = [];
    this.modals.forEach((value) => modals.push(value));
    const lastModal = modals.filter(Boolean).reverse()[0];
    document.body.insertBefore(this.mask, lastModal);
  },

  add(modal) {
    const container = document.createElement('div');
    this.modals.set(modal, container);

    document.body.classList.add('modal-open');
    document.body.appendChild(container);
    this.setMask();

    return container;
  },

  delete(modal) {
    const container = this.modals.get(modal);
    this.modals.delete(modal);
    document.body.removeChild(container);

    if (this.modals.size === 0) {
      document.body.classList.remove('modal-open');
      this.mask.remove();
      this._mask = null;
    } else {
      this.setMask();
    }
  },

  isActive(modal) {
    // TODO: Map iterators are broken in IE11 https://github.com/Financial-Times/polyfill-service/issues/1409
    const modals = [];
    this.modals.forEach((value, key) => modals.push(key));
    return modals.reverse()[0] === modal;
  },
};
