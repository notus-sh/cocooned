import EmitterDecorator from './emitterDecorator'
import Emitter from '../../cocooned/emitter'

const jQuerySupportMixin = (jQuery, Base) => class extends Base {
  #emitter

  get emitter () {
    if (typeof this.#emitter === 'undefined') {
      this.#emitter = new EmitterDecorator(new Emitter(['cocooned', 'cocoon']), jQuery)
    }

    return this.#emitter
  }

  notify (node, eventType, eventData) {
    if (node instanceof jQuery) {
      return super.notify(node.get(0), eventType, eventData)
    }
    return super.notify(node, eventType, eventData)
  }
}

const jQueryPluginMixin = function (jQuery, Cocooned) {
  jQuery.fn.cocooned = function (options) {
    return this.each((_i, el) => Cocooned.create(el, options))
  }
}

export {
  jQueryPluginMixin,
  jQuerySupportMixin
}