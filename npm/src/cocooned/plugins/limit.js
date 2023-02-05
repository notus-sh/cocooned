const limitMixin = (Base) => class extends Base {
  static defaultOptions () {
    return { ...super.defaultOptions(), ...{ limit: false } }
  }

  start () {
    super.start()
    if (this.options.limit === false) {
      return
    }

    this.container.addEventListener('cocooned:before-insert', e => {
      if (this.items.length < this.options.limit) {
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
