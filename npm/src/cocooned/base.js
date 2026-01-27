import { Emitter } from './events/emitter.js'
import { deprecator } from './deprecation.js'
import { disposable, Listener } from './disposable.js'

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

function defaultAnimator (item, fetch = false) {
  if (fetch) {
    item.dataset.cocoonedScrollHeight = item.scrollHeight
  }

  return [
    { height: `${item.dataset.cocoonedScrollHeight}px`, opacity: 1 },
    { height: `${item.dataset.cocoonedScrollHeight}px`, opacity: 0 },
    { height: 0, opacity: 0 }
  ]
}

const canAnimate = (
  'animate' in document.createElement('div') &&
  typeof document.createElement('div').animate === 'function'
)

const shouldAnimate = (
  'matchMedia' in window &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
)

const instances = Object.create(null)

class Base {
  static get defaultOptions () {
    return {
      animate: canAnimate && shouldAnimate,
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
    this.__uuid = uuidv4()
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
    if (!('cocoonedContainer' in this.container.dataset)) {
      deprecator('4.0').warn(
        'CSS classes based detection is deprecated',
        'cocooned_container Rails helper to declare containers'
      )
      this.container.dataset.cocoonedContainer = true
    }

    this.container.dataset.cocoonedUuid = this.__uuid
    this._onDispose(() => delete this.container.dataset.cocoonedUuid)

    instances[this.__uuid] = this
    this._onDispose(() => delete instances[this.__uuid])

    const hideDestroyed = () => { hideMarkedForDestruction(this, this.items) }

    hideDestroyed()
    this._addEventListener(this.container.ownerDocument, 'page:load', hideDestroyed)
    this._addEventListener(this.container.ownerDocument, 'turbo:load', hideDestroyed)
    this._addEventListener(this.container.ownerDocument, 'turbolinks:load', hideDestroyed)
  }

  dispose () {
    this._disposer.dispose()
    this._container = null
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
    const after = () => { item.style.display = 'none' }

    if (!opts.animate) {
      return Promise.resolve(after()).then(() => item)
    }
    return item.animate(keyframes, opts.duration).finished.then(after).then(() => item)
  }

  show (item, options = {}) {
    const opts = this._animationOptions(options)
    const keyframes = opts.animator(item, false).reverse()
    const before = () => { item.style.display = null }

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
  __disposer
  __emitter
  __uuid

  _addEventListener (target, type, listener) {
    this._disposer.use(new Listener(target, type, listener))
  }

  get _disposer () {
    if (typeof this.__disposer === 'undefined') {
      this.__disposer = new DisposableStack()
    }

    return this.__disposer
  }

  get _emitter () {
    if (typeof this.__emitter === 'undefined') {
      this.__emitter = new Emitter(this.constructor.eventNamespaces)
    }

    return this.__emitter
  }

  _onDispose (callback) {
    this._disposer.defer(callback)
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

disposable(Base)

export {
  Base
}
