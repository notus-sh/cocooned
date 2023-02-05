class Reindexer {
  constructor (cocooned, startAt = 0) {
    this.#cocooned = cocooned
    this.#startAt = startAt
  }

  reindex (event) {
    // Reindex can be prevented through a 'cocooned:before-reindex' event handler
    if (!this.#notify('before-reindex', event)) {
      return false
    }

    this.#positionFields.forEach((field, i) => field.setAttribute('value', i + this.#startAt))
    this.#notify('after-reindex', event)
  }

  /* Protected and private attributes and methods */
  #cocooned
  #startAt

  get #positionFields () {
    return this.#nodes.map(node => node.querySelector('input[name$="[position]"]'))
  }

  get #nodes () {
    return this.#cocooned.visibleItems
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
