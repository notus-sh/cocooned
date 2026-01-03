import { Add } from './core/triggers/add.js'
import { Remove } from './core/triggers/remove.js'
import { Replacement } from './core/triggers/add/replacement.js'
import { clickHandler, itemDelegatedClickHandler } from '../events/handlers.js'

const coreMixin = (Base) => class extends Base {
  static registerReplacement ({ tag = '*', attribute, delimiters }) {
    this.__replacements.push({ tag, attribute, delimiters })
  }

  static get replacements () {
    return this.__replacements
  }

  static replacementsFor (association) {
    return this.replacements.map(r => new Replacement({ association, ...r }))
  }

  static get selectors () {
    return {
      ...super.selectors,
      'triggers.add': ['[data-cocooned-trigger="add"]', '.cocooned-add'],
      'triggers.remove': ['[data-cocooned-trigger="remove"]', '.cocooned-remove']
    }
  }

  start () {
    super.start()

    this.addTriggers = Array.from(this.container.ownerDocument.querySelectorAll(this._selector('triggers.add')))
      .map(element => Add.create(element, this))
      .filter(trigger => this.toContainer(trigger.insertionNode) === this.container)

    this.addTriggers.forEach(add => {
      this._addEventListener(add.trigger, 'click', clickHandler((e) => add.handle(e)))
    })

    this._addEventListener(
      this.container,
      'click',
      itemDelegatedClickHandler(this, this._selector('triggers.remove'), (e) => {
        const trigger = new Remove(e.target, this)
        trigger.handle(e)
      })
    )
  }

  replacementsFor (association) {
    return this.constructor.replacementsFor(association)
  }

  /* Protected and private attributes and methods */
  static __replacements = [
    // Default attributes
    { tag: 'label', attribute: 'for', delimiters: ['_'] },
    { tag: '*', attribute: 'id', delimiters: ['_'] },
    { tag: '*', attribute: 'name', delimiters: ['[', ']'] },

    // Compatibility with Trix. See #65 on Github.
    { tag: 'trix-editor', attribute: 'input', delimiters: ['_'] }
  ]
}

export {
  coreMixin
}
