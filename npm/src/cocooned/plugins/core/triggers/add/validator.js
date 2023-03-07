import { Builder } from './builder'

class Validator {
  static validates (options) {
    const validator = new Validator(options)
    return validator.validates()
  }

  constructor (options) {
    this.#options = options
  }

  validates () {
    const optionNames = new Set(Object.keys(this.#options))
    const expected = new Set(['builder', 'count', 'node', 'method'])
    const missing = new Set(Array.from(expected.values()).filter(key => !optionNames.has(key)))

    if (missing.size !== 0) {
      throw new TypeError(`Missing options: ${Array.from(missing.values()).join(', ')}`)
    }

    this._validateBuilder()
    this._validateMethod()
  }

  /* Protected and private attributes and methods */
  #options

  _validateBuilder () {
    const builder = this.#options.builder
    if (!(builder instanceof Builder)) {
      throw new TypeError(
        `Invalid builder option: instance of Builder expected, got ${builder.constructor.name}`
      )
    }
  }

  _validateMethod () {
    const method = this.#options.method
    const supported = ['after', 'before', 'append', 'prepend', 'replaceWith']

    if (!supported.includes(method)) {
      throw new TypeError(
        `Invalid method option: expected one of ${supported.join(', ')}, got ${method}`
      )
    }
  }
}

export {
  Validator
}
