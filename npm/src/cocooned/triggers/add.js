import { Base } from './base'
import { Builder } from '../builder'

let counter = 0

function uniqueId () {
  return `${new Date().getTime()}${counter++}`
}

class Add extends Base {
  static create (trigger, cocooned) {
    const extractor = new Extractor(trigger)
    return new Add(trigger, cocooned, extractor.extract())
  }

  #item
  #options = {
    count: 1,
    // Other expected options:
    // builder: A Builder instance
    // method: Insertion method (one of: append, prepend, before, after, replaceWith)
    // node: Insertion Node as a DOM Element
  }

  constructor (trigger, cocooned, options = {}) {
    super(trigger, cocooned)

    this.#options = { ...this.#options, ...options }
    Validator.validates(this.#options)
  }

  handle (event) {
    for (let i = 0; i < this.#options.count; i++) {
      this.#item = this._build()
      if (!this._notify('before-insert', event)) {
        return false
      }

      this._insert()
      this._notify('after-insert', event)
    }
  }

  get _item () {
    return this.#item
  }

  get _notified () {
    return this.#options.node
  }

  _insert () {
    this.#options.node[this.#options.method](this._item)
  }

  _build () {
    return this.#options.builder.build(uniqueId()).firstElementChild
  }
}

class Validator {
  static validates (options) {
    const validator = new Validator(options)
    return validator.validates()
  }

  #options

  constructor(options) {
    this.#options = options
  }

  validates () {
    const optionNames = new Set(Object.keys(this.#options))
    const expected = new Set(['builder', 'count', 'node', 'method'])
    const missing = new Set(Array.from(expected.values()).filter(key => !optionNames.has(key)))

    if (missing.size === 0) {
      return
    }

    throw new TypeError(`Missing options: ${Array.from(missing.values()).join(', ')}`)
  }
}

class Traverser {
  #trigger
  #traversal

  constructor (trigger, traversal) {
    this.#trigger = trigger
    this.#traversal = traversal
  }

  resolve(selector) {
    if (this.#traversal in this.#trigger && typeof this.#trigger[this.#traversal] === 'function') {
      return this._tryMethod(traversal, selector)
    }

    if (this.#traversal in this.#trigger) {
      return this._tryProperty(traversal)
    }

    const method = `_${this.#traversal}`
    if (method in this) {
      return this[method](selector)
    }

    return null
  }

  _tryMethod(method, selector) {
    try {
      const resolved = this.#trigger[method](selector)
      if (resolved instanceof Element) {
        return resolved;
      }
    } catch (e) {}

    return null
  }

  _tryProperty(property) {
    const resolved = this.#trigger[property]
    if (resolved instanceof Element) {
      return resolved;
    }

    return null
  }

  _parent(selector) {
    if (this.#trigger.parentElement.matches(selector)) {
      return this.#trigger.parentElement
    }
    return null
  }

  _prev(selector) {
    if (this.#trigger.previousElementSibling.matches(selector)) {
      return this.#trigger.previousElementSibling
    }
    return null
  }

  _next(selector) {
    if (this.#trigger.nextElementSibling.matches(selector)) {
      return this.#trigger.nextElementSibling
    }
    return null
  }

  _sibling(selector) {
    return this.#trigger.parentElement.querySelector(selector)
  }
}

class Extractor {
  #trigger

  constructor (trigger) {
    this.#trigger = trigger
  }

  extract () {
    return ['builder', 'count', 'node', 'method'].reduce((options, option) => {
      // Sadly, this does not seem to work with #privateMethods
      const method = `_extract${option.charAt(0).toUpperCase() + option.slice(1)}`
      const extracted = this[method]()
      if (extracted !== null) {
        options[option] = extracted
      }

      return options
    }, {})
  }

  get #dataset () {
    return this.#trigger.dataset
  }

  _extractBuilder () {
    if (!('template' in this.#dataset && 'association' in this.#dataset)) {
      return null
    }

    const template = document.querySelector(`template[data-name=${this.#dataset.template}]`)
    if (template === null) {
      return null
    }

    return new Builder(template.content, `new_${this.#dataset.association}`)
  }

  _extractCount () {
    if ('associationInsertionCount' in this.#dataset) {
      return parseInt(this.#dataset.associationInsertionCount, 10)
    }

    if ('count' in this.#dataset) {
      return parseInt(this.#dataset.count, 10)
    }

    return null
  }

  _extractMethod () {
    if ('associationInsertionMethod' in this.#dataset) {
      return this.#dataset.associationInsertionMethod
    }

    return 'before'
  }

  _extractNode () {
    if (!('associationInsertionNode' in this.#dataset)) {
      return this.#trigger.parentElement
    }

    const node = this.#dataset.associationInsertionNode
    if (node === 'this') {
      return this.#trigger
    }

    if (!('associationInsertionTraversal' in this.#dataset)) {
      return this.#trigger.ownerDocument.querySelector(node)
    }

    const traversal = this.#dataset.associationInsertionTraversal
    const traverser = new Traverser(this.#trigger, traversal)

    return traverser.resolve(node)
  }
}

export {
  Add,
  Extractor
}
