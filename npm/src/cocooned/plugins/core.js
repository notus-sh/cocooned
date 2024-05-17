import { Add } from './core/triggers/add.js'
import { Remove } from './core/triggers/remove.js'
import { clickHandler, itemDelegatedClickHandler } from '../events/handlers.js'

const coreMixin = (Base) => class extends Base {
  static registerReplacement (attribute, ...delimiters) {
    this.__replacements.push({ attribute, delimiters })
  }

  static get replacements () {
    return this.__replacements;
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

    this.addTriggers.forEach(add => add.trigger.addEventListener(
      'click',
      clickHandler((e) => add.handle(e))
    ))

    this.container.addEventListener(
      'click',
      itemDelegatedClickHandler(this, this._selector('triggers.remove'), (e) => {
        const trigger = new Remove(e.target, this)
        trigger.handle(e)
      })
    )
  }

  get replacements () {
    return this.constructor.replacements;
  }

  /* Protected and private attributes and methods */
  static __replacements = [
    // Default attributes
    { attribute: 'for', delimiters: ['_'] },
    { attribute: 'id', delimiters: ['_'] },
    { attribute: 'name', delimiters: ['[', ']'] },

    // Compatibility with Trix. See #65 on Github.
    { attribute: 'input', delimiters: ['_'] },
  ];
}

export {
  coreMixin
}
