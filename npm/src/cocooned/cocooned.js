import { Base } from './base'
import { coreMixin } from './plugins/core'

class Cocooned extends coreMixin(Base) {
  static create (container, options) {
    const cocooned = new this.constructor(container, options)
    cocooned.start()

    return cocooned
  }

  static start () {
    document.querySelectorAll('[data-cocooned-container], [data-cocooned-options]')
      .forEach(element => this.constructor.create(element))
  }
}

export {
  Cocooned
}
