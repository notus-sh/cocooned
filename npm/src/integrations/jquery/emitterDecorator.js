class EmitterDecorator {
  emitter
  $

  constructor (emitter, $) {
    this.emitter = emitter
    this.$ = $
  }

  emit (target, type, detail = {}) {
    return !this.emitted(target, type, detail).some(e => e.isDefaultPrevented())
  }

  emitted (target, type, detail) {
    const natives = this.emitter.emitted(target, type, detail)
    const events = natives.map(e => this.#event(e, detail))
    events.forEach(e => this.#dispatch(target, e, Object.values(detail)))

    return events
  }

  #dispatch(target, event, args) {
    if (this.#stopped(event.originalEvent)) {
      return
    }
    return this.$(target).trigger(event, args)
  }

  #stopped(originalEvent) {
    return typeof originalEvent.isPropagationStopped === 'function' && originalEvent.isPropagationStopped()
  }

  #event (type, detail) {
    return this.$.Event(type, detail)
  }
}

export default EmitterDecorator
