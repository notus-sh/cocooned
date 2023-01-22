import { Base } from './base'

class Add extends Base {
  _options

  constructor (trigger, cocooned, options = {}) {
    super(trigger, cocooned)

    this._options = options
  }

  handle (event) {
    if (!this._notify('before-insert', event)) {
      return false
    }

    this._insert()
    this._notify('after-insert', event)
  }

  _insert () {
    this._trigger.matches('.dynamic') ? this._item.remove() : this._markForDestruction()
  }
}

export {
  Add
}
