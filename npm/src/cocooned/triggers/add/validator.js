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

export {
  Validator
}
