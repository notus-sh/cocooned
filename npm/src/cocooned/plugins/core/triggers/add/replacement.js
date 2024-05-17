/**
 * Borrowed from Lodash
 * See https://lodash.com/docs/#escapeRegExp
 */
const reRegExpChar = /[\\^$.*+?()[\]{}|]/g
const reHasRegExpChar = RegExp(reRegExpChar.source)

class Replacement {
  attribute

  constructor (attribute, name, startDelimiter, endDelimiter = null) {
    this.attribute = attribute

    this.#name = name
    this.#startDelimiter = startDelimiter
    this.#endDelimiter = endDelimiter || startDelimiter
  }

  apply (node, id) {
    const value = node.getAttribute(this.attribute)
    if (!this.#regexp.test(value)) {
      return
    }

    node.setAttribute(this.attribute, value.replace(this.#regexp, this.#replacement(id)))
  }

  /* Protected and private attributes and methods */
  #name
  #startDelimiter
  #endDelimiter

  #replacement (id) {
    return `${this.#startDelimiter}${id}${this.#endDelimiter}$1`
  }

  get #regexp () {
    const escaped = this.#escape(`${this.#startDelimiter}${this.#name}${this.#endDelimiter}`)
    return new RegExp(`${escaped}(.*?)`, 'g')
  }

  #escape (string) {
    return (string && reHasRegExpChar.test(string))
        ? string.replace(reRegExpChar, '\\$&')
        : (string || '')
  }
}

export {
  Replacement
}
