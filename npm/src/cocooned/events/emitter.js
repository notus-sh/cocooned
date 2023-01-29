class Emitter {
  constructor (namespaces = ['cocooned']) {
    this.#namespaces = namespaces
  }

  emit (target, type, detail = {}) {
    return !this.#emitted(target, type, detail).some(e => e.defaultPrevented)
  }

  /* Protected and private attributes and methods */
  #namespaces

  #emitted (target, type, detail = {}) {
    const events = this.#events(type, detail)
    events.forEach(e => this.#dispatch(target, e))

    return events
  }

  #dispatch(target, event) {
    return target.dispatchEvent(event)
  }

  #events (type, detail) {
    return this.#namespaces.map(ns => this.#event(`${ns}:${type}`, detail))
  }

  #event (type, detail) {
    return new CustomEvent(type, { bubbles: true, cancelable: true, detail })
  }
}

export {
  Emitter
}
