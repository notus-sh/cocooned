class Reindexer {
  #cocooned
  #startAt

  constructor (cocooned, startAt = 0) {
    this.#cocooned = cocooned
    this.#startAt = startAt
  }

  // Reindex can be prevented through a 'cocooned:before-reindex' event handler
  reindex (event) {
    if (!this.#notify('before-reindex', event)) {
      return false
    }

    this.#positionFields.forEach((field, i) => field.setAttribute('value', i + this.#startAt))
    this.#notify('after-reindex', event)
  }

  get #positionFields () {
    return this.#nodes.map(node => node.querySelector('input[name$="[position]"]'))
  }

  get #nodes () {
    return this.#cocooned.selection.visibleItems
  }

  #notify (eventName, originalEvent) {
    return this.#cocooned.notify(this.#cocooned.container, eventName, this.#eventData(originalEvent))
  }

  #eventData (originalEvent) {
    return { nodes: this.#nodes, cocooned: this.#cocooned, originalEvent }
  }
}

export {
  Reindexer
}
