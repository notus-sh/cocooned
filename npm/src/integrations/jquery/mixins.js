import EmitterDecorator from './emitterDecorator'
import Emitter from '../../cocooned/emitter';

const jQuerySupportMixin = (Base) => class extends Base {
  #emitter

  get emitter () {
    if (typeof this.#emitter === 'undefined') {
      this.#emitter = new EmitterDecorator(new Emitter(['cocooned', 'cocoon']))
    }

    return this.#emitter
  }

  notify (node, eventType, eventData) {
    if (node instanceof $) {
      return super.notify(node.get(0), eventType, eventData)
    }
    return super.notify(node, eventType, eventData)
  }
}

export {
  jQuerySupportMixin
}
