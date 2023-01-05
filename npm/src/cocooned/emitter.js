class Emitter {
  namespaces

  constructor (namespaces = ['cocooned']) {
    this.namespaces = namespaces
  }

  emit (target, type, detail = {}) {
    return !this.#events(type, detail).map(e => this.#dispatch(target, e)).includes(true)
  }

  #dispatch(target, event) {
    target.dispatchEvent(event)
    return event.defaultPrevented
  }

  #events (type, detail) {
    return this.namespaces.map(ns => this.#event(`${ns}:${type}`, detail))
  }

  #event (type, detail) {
    return new CustomEvent(type, { bubbles: true, cancelable: true, detail })
  }
}

export default Emitter
