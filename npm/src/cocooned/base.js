import { Emitter } from './events/emitter'
import { Selection } from './selection'

function hideMarkedForDestruction (cocooned, items) {
  items.forEach(item => {
    const destroy = item.querySelector('input[type=hidden][name$="[_destroy]"]')
    if (destroy === null) {
      return
    }
    if (destroy.getAttribute('value') !== 'true') {
      return
    }

    cocooned.hide(item)
  })
}

class Base {
  static defaultOptions () {
    return {}
  }

  static eventNamespaces () {
    return ['cocooned']
  }

  static create (container, options) {
    const cocooned = new this.constructor(container, options)
    cocooned.start()

    return cocooned
  }

  static start () {
    document.querySelectorAll('*[data-cocooned-options]').forEach(element => this.constructor.create(element))
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
    this._bindEvents()
    hideMarkedForDestruction(this, this.selection.items)
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

  _bindEvents () {
    const hideDestroyed = () => { hideMarkedForDestruction(this, this.selection.items) }
    this.container.ownerDocument.addEventListener('page:load', hideDestroyed)
    this.container.ownerDocument.addEventListener('turbo:load', hideDestroyed)
    this.container.ownerDocument.addEventListener('turbolinks:load', hideDestroyed)
  }
}

export {
  Base
}
