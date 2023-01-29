import { Emitter } from './events/emitter'
import { clickHandler, delegatedClickHandler } from './events/handlers'
import { Selection } from './selection'
import { Add } from './triggers/add'
import { Remove } from './triggers/remove'

function hideMarkedForDestruction (cocooned, items) {
  items.map(item => {
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
    this.addTriggers = Array.from(this.container.ownerDocument.querySelectorAll(this.selection.selector('triggers.add')))
      .map(element => Add.create(element, this))
      .filter(trigger => this.selection.toContainer(trigger.insertionNode) === this.container)

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
    this.addTriggers.forEach(add => add.trigger.addEventListener(
      'click',
      clickHandler((e) => add.handle(e))
    ))

    this.container.addEventListener(
      'click',
      delegatedClickHandler(this.selection.selector('triggers.remove'), (e) => {
        const trigger = new Remove(e.target, this)
        trigger.handle(e)
      })
    )

    const hideDestroyed = () => { hideMarkedForDestruction(this, this.selection.items) }
    this.container.ownerDocument.addEventListener('page:load', hideDestroyed)
    this.container.ownerDocument.addEventListener('turbo:load', hideDestroyed)
    this.container.ownerDocument.addEventListener('turbolinks:load', hideDestroyed)
  }
}

export {
  Base
}
