import { Add } from './core/triggers/add.js'
import { Remove } from './core/triggers/remove.js'
import { clickHandler, delegatedClickHandler } from '../events/handlers.js'

const coreMixin = (Base) => class extends Base {
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
      delegatedClickHandler(this._selector('triggers.remove'), (e) => {
        const trigger = new Remove(e.target, this)
        trigger.handle(e)
      })
    )
  }
}

export {
  coreMixin
}
