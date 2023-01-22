import { Base } from './base'

let counter = 0

function uniqueId () {
  return `${new Date().getTime()}${counter++}`
}

class Add extends Base {
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
    this.#validateOptions()
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

  #validateOptions () {
    const optionNames = new Set(Object.keys(this.#options))
    const expected = new Set(['builder', 'count', 'node', 'method'])
    const missing = new Set(Array.from(expected.values()).filter(key => !optionNames.has(key)))

    if (missing.size === 0) {
      return
    }

    throw new TypeError(`Missing options: ${Array.from(missing.values()).join(', ')}`)
  }
}

export {
  Add
}
