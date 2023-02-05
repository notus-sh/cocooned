import { Emitter } from './events/emitter'
import { Selection } from './selection'


class Base {
  static defaultOptions () {
    return {}
  }

  static eventNamespaces () {
    return ['cocooned']
  }

  constructor (container, options) {
    this.container = container
    this.options = this.constructor._normalizeOptions({
      ...this.constructor.defaultOptions(),
      ...('cocoonedOptions' in container.dataset ? JSON.parse(container.dataset.cocoonedOptions) : {}),
      ...(options || {})
    })
  }

  get emitter () {
    if (typeof this.#emitter === 'undefined') {
      this.#emitter = new Emitter(this.constructor.eventNamespaces())
    }

    return this.#emitter
  }

  get selection () {
    if (typeof this.#selection === 'undefined') {
      this.#selection = new Selection(this.container)
    }

    return this.#selection
  }

  start () {
    this.container.classList.add('cocooned-container')
  }

  notify (node, eventType, eventData) {
    return this.emitter.emit(node, eventType, eventData)
  }

  hide (node, callback) {
    return this.selection.hide(node, callback)
  }

  show (node, callback) {
    return this.selection.show(node, callback)
  }

  /* Protected and private attributes and methods */
  static _normalizeOptions (options) {
    return options
  }

  #emitter
  #selection
}

export {
  Base
}
