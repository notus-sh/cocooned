const limitMixin = (Base) => class extends Base {
  static defaultOptions () {
    return { ...super.defaultOptions(), ...{ limit: false } }
  }

  _bindEvents () {
    super._bindEvents()
    if (this.options.limit === false) {
      return
    }

    this.container.addEventListener('cocooned:before-insert', e => {
      if (this.selection.visibleItems.length < this.options.limit) {
        return
      }

      e.preventDefault()
      this.notify(this.container, 'limit-reached', e.detail)
    })
  }
}

export {
  limitMixin
}
