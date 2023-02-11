import { Emitter } from './events/emitter'

// Borrowed from <https://stackoverflow.com/a/2117523>
function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
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

    cocooned.hide(item, { animate: false })
  })
}

function defaultAnimator(item, fetch = false) {
  if (fetch) {
    item.dataset.cocoonedScrollHeight = item.scrollHeight
  }

  return [
    { height: `${item.dataset.cocoonedScrollHeight}px`, opacity: 1 },
    { height: `${item.dataset.cocoonedScrollHeight}px`, opacity: 0 },
    { height: 0, opacity: 0 }
  ]
}

const instances = Object.create(null)

class Base {
  static get defaultOptions () {
    const element = document.createElement('div')
    return {
      animate: ('animate' in element && typeof element.animate == 'function'),
      animator: defaultAnimator,
      duration: 450
    }
  }

  static get eventNamespaces () {
    return ['cocooned']
  }

  static get selectors () {
    return {
      container: ['[data-cocooned-container]', '.cocooned-container'],
      item: ['[data-cocooned-item]', '.cocooned-item']
    }
  }

  static getInstance (uuid) {
    return instances[uuid]
  }

  constructor (container, options) {
    this._container = container
    this._uuid = uuidv4()
    this._options = this.constructor._normalizeOptions({
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
    this.container.dataset.cocoonedContainer = true
    this.container.dataset.cocoonedUuid = this._uuid
    instances[this._uuid] = this

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
      .filter(item => !('display' in item.style && item.style.display === 'none'))
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

  hide (item, options = {}) {
    const opts = this._animationOptions(options)
    const keyframes = opts.animator(item, true)
    const after = () => item.style.display = 'none'

    if (!opts.animate) {
      return Promise.resolve(after()).then(() => item)
    }
    return item.animate(keyframes, opts.duration).finished.then(after).then(() => item)
  }

  show (item, options = {}) {
    const opts = this._animationOptions(options)
    const keyframes = opts.animator(item, false).reverse()
    const before = () => item.style.display = null

    const promise = Promise.resolve(before())
    if (!opts.animate) {
      return promise.then(() => item)
    }
    return promise.then(() => item.animate(keyframes, opts.duration).finished).then(() => item)
  }

  /* Protected and private attributes and methods */
  static _normalizeOptions (options) {
    return options
  }

  _container
  _options
  __uuid
  __emitter

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

  _animationOptions (options) {
    const defaults = (({ animate, animator, duration }) => ({ animate, animator, duration }))(this._options)
    return { ...defaults, ...options }
  }
}

export {
  Base
}
