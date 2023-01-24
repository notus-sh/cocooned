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

export {
  Traverser
}
