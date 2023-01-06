class EmitterDecorator {
  emitter
  $

  constructor (emitter, $) {
    this.emitter = emitter
    this.$ = $
  }

  get namespaces () {
    return this.emitter.namespaces
  }

  emit (target, type, detail = {}) {
    const nativePrevented = this.emitter.emit(target, type, detail)
    return this.#emit(target, type, detail) && nativePrevented
  }

  #emit (target, type, detail) {
    return !this.#events(type, detail).map(e => this.#dispatch(target, e, Object.values(detail))).includes(true)
  }

  #dispatch(target, event, args) {
    this.$(target).trigger(event, args)
    return event.isDefaultPrevented()
  }

  #events (type, detail) {
    return this.namespaces.map(ns => this.$.Event(`${ns}:${type}`, detail))
  }
}

export default EmitterDecorator
