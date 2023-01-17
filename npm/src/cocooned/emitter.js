class EmitterEvent extends CustomEvent {
  #stopped = false

  isPropagationStopped() {
    return this.#stopped
  }

  stopPropagation () {
    this.#stopped = true
    super.stopPropagation()
  }

  stopImmediatePropagation () {
    this.#stopped = true
    super.stopImmediatePropagation()
  }
}

class Emitter {
  namespaces

  constructor (namespaces = ['cocooned']) {
    this.namespaces = namespaces
  }

  emit (target, type, detail = {}) {
    return !this.emitted(target, type, detail).some(e => e.defaultPrevented)
  }

  emitted (target, type, detail = {}) {
    const events = this.#events(type, detail)
    events.forEach(e => this.#dispatch(target, e))

    return events
  }

  #dispatch(target, event) {
    return target.dispatchEvent(event)
  }

  #events (type, detail) {
    return this.namespaces.map(ns => this.#event(`${ns}:${type}`, detail))
  }

  #event (type, detail) {
    return new EmitterEvent(type, { bubbles: true, cancelable: true, detail })
  }
}

export default Emitter
