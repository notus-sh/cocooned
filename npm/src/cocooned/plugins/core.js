import { Add } from './core/triggers/add'
import { Remove } from './core/triggers/remove'
import { clickHandler, delegatedClickHandler } from '../events/handlers'

function hideMarkedForDestruction (cocooned, items) {
  items.forEach(item => {
    const destroy = item.querySelector('input[type=hidden][name$="[_destroy]"]')
    if (destroy === null) {
      return
    }
    if (destroy.getAttribute('value') !== 'true') {
      return
    }

    cocooned.hide(item)
  })
}

const coreMixin = (Base) => class extends Base {
  start () {
    super.start()

    const hideDestroyed = () => { hideMarkedForDestruction(this, this.selection.items) }

    hideDestroyed()
    this.container.ownerDocument.addEventListener('page:load', hideDestroyed)
    this.container.ownerDocument.addEventListener('turbo:load', hideDestroyed)
    this.container.ownerDocument.addEventListener('turbolinks:load', hideDestroyed)

    this.addTriggers = Array.from(this.container.ownerDocument.querySelectorAll(this.selection.selector('triggers.add')))
        .map(element => Add.create(element, this))
        .filter(trigger => this.selection.toContainer(trigger.insertionNode) === this.container)

    this.addTriggers.forEach(add => add.trigger.addEventListener(
        'click',
        clickHandler((e) => add.handle(e))
    ))

    this.container.addEventListener(
        'click',
        delegatedClickHandler(this.selection.selector('triggers.remove'), (e) => {
          const trigger = new Remove(e.target, this)
          trigger.handle(e)
        })
    )
  }
}

export {
  coreMixin
}
