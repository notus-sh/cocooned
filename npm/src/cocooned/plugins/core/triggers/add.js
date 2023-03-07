import { Trigger } from '../../../trigger'
import { Extractor } from './add/extractor'
import { Validator } from './add/validator'

let counter = 0

function uniqueId () {
  return `${new Date().getTime()}${counter++}`
}

class Add extends Trigger {
  static create (trigger, cocooned) {
    const extractor = new Extractor(trigger)
    return new Add(trigger, cocooned, extractor.extract())
  }

  constructor (trigger, cocooned, options = {}) {
    super(trigger, cocooned)

    this.#options = { ...this.#options, ...options }
    Validator.validates(this.#options)
  }

  get insertionNode () {
    return this.#options.node
  }

  handle (event) {
    for (let i = 0; i < this.#options.count; i++) {
      this.#item = this._build()

      // Insert can be prevented through a 'cocooned:before-insert' event handler
      if (!this._notify('before-insert', event)) {
        return false
      }

      this._insert()
      this._notify('after-insert', event)
    }
  }

  /* Protected and private attributes and methods */
  #item
  #options = {
    count: 1
    // Other expected options:
    // builder: A Builder instance
    // method: Insertion method (one of: append, prepend, before, after, replaceWith)
    // node: Insertion Node as a DOM Element
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

export {
  Add
}
