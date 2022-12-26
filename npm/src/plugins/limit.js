import $ from "jquery";

const limitMixin = (Base) => class extends Base {
  static defaultOptions() {
    return Object.assign({}, super.defaultOptions(), { limit: false })
  }

  bindEvents() {
    super.bindEvents()
    if (this.options.limit === false) {
      return
    }

    this.limit = this.options.limit
    this.container.on('cocooned:before-insert', function (e) {
      const cocooned = e.cocooned
      if (cocooned.getLength() < cocooned.limit) {
        return
      }

      e.stopPropagation()
      const eventData = { link: e.link, node: e.node, cocooned, originalEvent: e }
      cocooned.notify(cocooned.container, 'limit-reached', eventData)
    })
  }

  getLength() {
    // jQuery :visible selector use element.offset(Width|Height), which is not available in jsdom.
    return this.getItems().filter(function () {
      return $(this).css('display') !== 'none'
    }).length
  }
}

export default limitMixin
