class Traverser {
  #origin
  #traversal

  constructor (origin, traversal) {
    this.#origin = origin
    this.#traversal = traversal
  }

  resolve(selector) {
    if (this.#traversal in this.#origin && typeof this.#origin[this.#traversal] === 'function') {
      return this._tryMethod(this.#traversal, selector)
    }

    if (this.#traversal in this.#origin) {
      return this._tryProperty(this.#traversal)
    }

    const method = `_${this.#traversal}`
    if (method in this) {
      return this[method](selector)
    }

    return null
  }

  _tryMethod(method, selector) {
    try {
      const resolved = this.#origin[method](selector)
      if (resolved instanceof HTMLElement) {
        return resolved;
      }
    } catch (e) {}

    return null
  }

  _tryProperty(property) {
    const resolved = this.#origin[property]
    if (resolved instanceof HTMLElement) {
      return resolved;
    }

    return null
  }

  _parent(selector) {
    if (this.#origin.parentElement.matches(selector)) {
      return this.#origin.parentElement
    }
    return null
  }

  _prev(selector) {
    if (this.#origin.previousElementSibling.matches(selector)) {
      return this.#origin.previousElementSibling
    }
    return null
  }

  _next(selector) {
    if (this.#origin.nextElementSibling.matches(selector)) {
      return this.#origin.nextElementSibling
    }
    return null
  }

  _siblings(selector) {
    return this.#origin.parentElement.querySelector(selector)
  }
}

export {
  Traverser
}
