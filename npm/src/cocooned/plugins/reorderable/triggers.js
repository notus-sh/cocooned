import { Trigger } from '../../trigger.js'

class Move extends Trigger {
  handle (event) {
    if (this._pivotItem === null) {
      return
    }

    // Moves can be prevented through a 'cocooned:before-move' event handler
    if (!this._notify('before-move', event)) {
      return false
    }

    this._hide(this._item).then(() => {
      this._move()
      this._show(this._item).then(() => this._notify('after-move', event))
    })
  }

  /* Protected and private attributes and methods */
  get _pivotItem () {
    throw new TypeError('_pivotItem() must be defined in subclasses')
  }

  _move () {
    throw new TypeError('_move() must be defined in subclasses')
  }

  _findPivotItem (origin, method) {
    let sibling = origin

    do {
      sibling = sibling[method]
      if (sibling !== null && this._cocooned.contains(sibling)) {
        break
      }
    } while (sibling !== null)

    return sibling
  }
}

class Up extends Move {
  /* Protected and private attributes and methods */
  #pivotItem

  get _pivotItem () {
    if (typeof this.#pivotItem === 'undefined') {
      this.#pivotItem = this._findPivotItem(this._item, 'previousElementSibling')
    }

    return this.#pivotItem
  }

  _move () {
    this._pivotItem.before(this._item)
  }
}

class Down extends Move {
  /* Protected and private attributes and methods */
  #pivotItem

  get _pivotItem () {
    if (typeof this.#pivotItem === 'undefined') {
      this.#pivotItem = this._findPivotItem(this._item, 'nextElementSibling')
    }

    return this.#pivotItem
  }

  _move () {
    this._pivotItem.after(this._item)
  }
}

export {
  Up,
  Down
}
