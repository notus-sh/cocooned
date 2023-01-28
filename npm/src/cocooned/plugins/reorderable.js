import { Up, Down } from './reorderable/triggers'
import { Reindexer } from './reorderable/reindexer'
import { delegatedClickHandler } from '../events/handlers'

function clickHandler(selector, cocooned, triggerClass) {
  return delegatedClickHandler(selector, (e) => {
    const trigger = new triggerClass(e.target, cocooned)
    trigger.handle(e)
  })
}

const reorderableMixin = (Base) => class extends Base {
  static defaultOptions () {
    return { ...super.defaultOptions(), ...{ reorderable: false } }
  }

  _bindEvents () {
    super._bindEvents()
    if (this.options.reorderable === false) {
      return
    }

    const container = this.container
    const form = container.closest('form')

    container.addEventListener('cocooned:after-insert', e => this._reindexer.reindex(e))
    container.addEventListener('cocooned:after-remove', e => this._reindexer.reindex(e))
    container.addEventListener('cocooned:after-move', e => this._reindexer.reindex(e))
    if (form !== null) {
      form.addEventListener('submit', e => this._reindexer.reindex(e))
    }

    container.addEventListener('click', clickHandler(this.selection.selector('triggers.up'), this, Up))
    container.addEventListener('click', clickHandler(this.selection.selector('triggers.down'), this, Down))
  }

  /* Protected and private attributes and methods */
  static _normalizeOptions (options) {
    const normalized = super._normalizeOptions(options)
    if (typeof normalized.reorderable === 'boolean' && normalized.reorderable) {
      normalized.reorderable = { startAt: 1 }
    }

    return normalized
  }

  #reindexer

  get _reindexer () {
    if (typeof this.#reindexer === 'undefined') {
      this.#reindexer = new Reindexer(this, this.options.reorderable.startAt)
    }

    return this.#reindexer
  }
}

export {
  reorderableMixin
}
