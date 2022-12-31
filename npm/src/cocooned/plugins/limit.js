import $ from 'jquery'

const limitMixin = (Base) => class extends Base {
  static defaultOptions () {
    return { ...super.defaultOptions(), ...{ limit: false } }
  }

  bindEvents () {
    super.bindEvents()
    if (this.options.limit === false) {
      return
    }

    this.container.on('cocooned:before-insert', e => {
      if (this.length < this.options.limit) {
        return
      }

      e.stopPropagation()
      const eventData = { link: e.link, node: e.node, cocooned: this, originalEvent: e }
      this.notify(this.container, 'limit-reached', eventData)
    })
  }

  get length () {
    // jQuery :visible selector use element.offset(Width|Height), which is not available in jsdom.
    return this.getItems().filter((_i, element) => $(element).css('display') !== 'none').length
  }
}

export default limitMixin
