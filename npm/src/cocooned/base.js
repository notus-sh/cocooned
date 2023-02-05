import { Emitter } from './events/emitter'

const scopedStyles = `
  .cocooned-item { overflow: hidden; transition: opacity .45s ease-out, max-height .45s ease-out .45; }
  .cocooned-item--visible { opacity: 1; max-height: 100%; }
  .cocooned-item--hidden { opacity: 0; max-height: 0%; }
`

function createScopedStyles (container, styles) {
  const element = container.ownerDocument.createElement('style')
  element.setAttribute('scoped', 'scoped')
  element.setAttribute('type', 'text/css')
  element.innerHTML = styles

  return element
}

class Base {
  static defaultOptions () {
    return {}
  }

  static eventNamespaces () {
    return ['cocooned']
  }

  static scopedStyles = scopedStyles

  static get selectors () {
    return {
      container: ['.cocooned-container'],
      item: ['.cocooned-item', '.nested-fields'],
      'triggers.add': ['.cocooned-add', '.add_fields'],
      'triggers.remove': ['.cocooned-remove', '.remove_fields'],
      'triggers.up': ['.cocooned-move-up'],
      'triggers.down': ['.cocooned-move-down']
    }
  }

  constructor (container, options) {
    this._container = container
    this._options = this.constructor._normalizeOptions({
      ...this._options,
      ...this.constructor.defaultOptions(),
      ...('cocoonedOptions' in container.dataset ? JSON.parse(container.dataset.cocoonedOptions) : {}),
      ...(options || {})
    })
  }

  get container () {
    return this._container
  }

  get options () {
    return this._options
  }

  /* Notification methods */
  get emitter () {
    if (typeof this._emitter === 'undefined') {
      this._emitter = new Emitter(this.constructor.eventNamespaces())
    }

    return this._emitter
  }

  notify (node, eventType, eventData) {
    return this.emitter.emit(node, eventType, eventData)
  }

  /* Startup methods */
  start () {
    this.container.classList.add('cocooned-container')
    this.container.prepend(createScopedStyles(this.container, this.constructor.scopedStyles))
  }

  /* Selections methods */
  get items () {
    return Array.from(this.container.querySelectorAll(this.selector('item')))
        .filter(element => element.closest(this.selector('container')) === this.container)
  }

  get visibleItems () {
    return this.items.filter(item => !item.classList.contains('cocooned-item--hidden'))
  }

  toContainer (node) {
    return node.closest(this.selector('container'))
  }

  toItem (node) {
    return node.closest(this.selector('item'))
  }

  contains (node) {
    return this.items.includes(this.toItem(node))
  }

  matches (node, selectorName) {
    return this.selectors(selectorName).some(s => node.matches(s)) && this.contains(node)
  }

  selectors (name) {
    return this.constructor.selectors[name]
  }

  selector (name) {
    return this.selectors(name).join(', ')
  }

  hide (item, callback) {
    this._toggle(item, 'cocooned-item--visible', 'cocooned-item--hidden', callback)
  }

  show (item, callback) {
    this._toggle(item, 'cocooned-item--hidden', 'cocooned-item--visible', callback)
  }

  /* Protected and private attributes and methods */
  static _normalizeOptions (options) {
    return options
  }

  _container
  _emitter
  _options = { transitions: !(process?.env?.NODE_ENV === 'test') }

  _toggle (item, removedClass, addedClass, callback) {
    if (typeof callback === 'function' && this.options.transitions) {
      item.addEventListener('transitionend', callback, { once: true })
    }

    if (item.classList.contains(removedClass)) {
      item.classList.replace(removedClass, addedClass)
    } else {
      item.classList.add(addedClass)
    }

    if (typeof callback === 'function' && !this.options.transitions) {
      callback()
    }
  }
}

export {
  Base
}
