/**
 * Borrowed from Lodash
 * See https://lodash.com/docs/#escapeRegExp
 */
const reRegExpChar = /[\\^$.*+?()[\]{}|]/g
const reHasRegExpChar = RegExp(reRegExpChar.source)

class Replacement {
  #name
  #startDelimiter
  #endDelimiter

  constructor(name, startDelimiter, endDelimiter = null) {
    this.#name = name
    this.#startDelimiter = startDelimiter
    this.#endDelimiter = endDelimiter || startDelimiter
  }

  replacement(id) {
    return `${this.#startDelimiter}${id}${this.#endDelimiter}$1`
  }

  regexp() {
    const escaped = this.#escape(`${this.#startDelimiter}${this.#name}${this.#endDelimiter}`)
    return new RegExp(`${escaped}(.*?\\s)`, 'g')
  }

  #escape(string) {
    return (string && reHasRegExpChar.test(string))
        ? string.replace(reRegExpChar, '\\$&')
        : (string || '')
  }
}

class Builder {
  #template
  #replacements

  constructor(template, singular, plural) {
    this.#template = template
    this.#replacements = [
      new Replacement(plural, '[', ']'),
      new Replacement(singular, '[', ']'),
      new Replacement(plural, '_'),
      new Replacement(singular, '_'),
    ]
  }

  build(id) {
    return this.#replacements.reduce((string, replacement) => {
      return string.replace(replacement.regexp(), replacement.replacement(id))
    }, this.#template)

    return $(html)
  }
}

export default Builder
