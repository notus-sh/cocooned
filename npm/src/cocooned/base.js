import { Emitter } from './events/emitter'

// Borrowed from <https://stackoverflow.com/a/2117523>
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

const scopedStyles = `
  .cocooned-item { overflow: hidden; transition: opacity .45s ease-out, max-height .45s ease-out; }
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

function toggle (item, removedClass, addedClass, useTransitions, callback) {
  if (typeof callback === 'function' && useTransitions) {
    item.addEventListener('transitionend', callback, { once: true })
  }

  if (item.classList.contains(removedClass)) {
    item.classList.replace(removedClass, addedClass)
  } else {
    item.classList.add(addedClass)
  }

  if (typeof callback === 'function' && !useTransitions) {
    callback()
  }
}

const instances = Object.create(null)

class Base {
  static get defaultOptions () {
    return {}
  }

  static get eventNamespaces () {
    return ['cocooned']
  }

  static scopedStyles = scopedStyles

  static get selectors () {
    return {
      container: ['.cocooned-container'],
      item: ['.cocooned-item']
    }
  }

  static getInstance(uuid) {
    return instances[uuid]
  }

  constructor (container, options) {
    this._container = container
    this._uuid = uuidv4()
    this._options = this.constructor._normalizeOptions({
      ...this._options,
      ...this.constructor.defaultOptions,
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

  start () {
    this.container.dataset.cocoonedUuid = this._uuid
    instances[this._uuid] = this

    this.container.classList.add('cocooned-container')
    this.container.prepend(createScopedStyles(this.container, this.constructor.scopedStyles))

    const hideDestroyed = () => { hideMarkedForDestruction(this, this.items) }

    hideDestroyed()
    this.container.ownerDocument.addEventListener('page:load', hideDestroyed)
    this.container.ownerDocument.addEventListener('turbo:load', hideDestroyed)
    this.container.ownerDocument.addEventListener('turbolinks:load', hideDestroyed)
  }

  notify (node, eventType, eventData) {
    return this._emitter.emit(node, eventType, eventData)
  }

  /* Selections methods */
  get items () {
    return Array.from(this.container.querySelectorAll(this._selector('item')))
        .filter(item => this.toContainer(item) === this.container)
        .filter(item => !item.classList.contains('cocooned-item--hidden'))
  }

  toContainer (node) {
    return node.closest(this._selector('container'))
  }

  toItem (node) {
    return node.closest(this._selector('item'))
  }

  contains (node) {
    return this.items.includes(this.toItem(node))
  }

  hide (item, callback) {
    return toggle(item, 'cocooned-item--visible', 'cocooned-item--hidden', this.options.transitions, callback)
  }

  show (item, callback) {
    return toggle(item, 'cocooned-item--hidden', 'cocooned-item--visible', this.options.transitions, callback)
  }

  /* Protected and private attributes and methods */
  static _normalizeOptions (options) {
    return options
  }

  __uuid
  _container
  __emitter
  _options = { transitions: !(process?.env?.NODE_ENV === 'test') }

  get _emitter () {
    if (typeof this.__emitter === 'undefined') {
      this.__emitter = new Emitter(this.constructor.eventNamespaces)
    }

    return this.__emitter
  }

  _selectors (name) {
    return this.constructor.selectors[name]
  }

  _selector (name) {
    return this._selectors(name).join(', ')
  }
}

export {
  Base
}
