import { Up, Down } from './reorderable/triggers.js'
import { Reindexer } from './reorderable/reindexer.js'
import { itemDelegatedClickHandler } from '../events/handlers.js'

function clickHandler (cocooned, selector, TriggerClass) {
  return itemDelegatedClickHandler(cocooned, selector, (e) => {
    const trigger = new TriggerClass(e.target, cocooned)
    trigger.handle(e)
  })
}

const reorderableMixin = (Base) => class extends Base {
  static get defaultOptions () {
    return { ...super.defaultOptions, ...{ reorderable: false } }
  }

  static get selectors () {
    return {
      ...super.selectors,
      'triggers.up': ['[data-cocooned-trigger="up"]', '.cocooned-move-up'],
      'triggers.down': ['[data-cocooned-trigger="down"]', '.cocooned-move-down']
    }
  }

  start () {
    super.start()
    if (this.options.reorderable === false) {
      return
    }

    this._addEventListener(this.container, 'cocooned:after-insert', e => this._reindexer.reindex(e))
    this._addEventListener(this.container, 'cocooned:after-remove', e => this._reindexer.reindex(e))
    this._addEventListener(this.container, 'cocooned:after-move', e => this._reindexer.reindex(e))
    const form = this.container.closest('form')
    if (form !== null) {
      this._addEventListener(form, 'submit', e => this._reindexer.reindex(e))
    }

    this._addEventListener(this.container, 'click', clickHandler(this, this._selector('triggers.up'), Up))
    this._addEventListener(this.container, 'click', clickHandler(this, this._selector('triggers.down'), Down))
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
