import { Base } from '../../triggers/base'

class Move extends Base {
  handle (event) {
    if (this._pivotItem === null) {
      return
    }

    if (!this._notify('before-move', event)) {
      return false
    }

    this._hide(this._item, () => {
      this._move()
      this._show(this._item, () => this._notify('after-move', event))
    })
  }

  get _pivotItem () {
    if (this._sibling !== null && this._cocooned.selection.contains(this._sibling)) {
      return this._sibling
    }
    return null
  }

  get _sibling () {
    throw new TypeError('_sibling() must be defined in subclasses')
  }

  _move () {
    throw new TypeError('_move() must be defined in subclasses')
  }
}

class Up extends Move {
  get _sibling () {
    return this._item.previousElementSibling
  }

  _move () {
    this._pivotItem.before(this._item)
  }
}

class Down extends Move {
  get _sibling () {
    return this._item.nextElementSibling
  }

  _move () {
    this._pivotItem.after(this._item)
  }
}

export {
  Up,
  Down
}
