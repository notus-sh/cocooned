import { Base } from './base'

class Remove extends Base {
  #notified

  // Removal can be prevented through a 'cocooned:before-remove' event handler
  handle (event) {
    if (!this._notify('before-remove', event)) {
      return false
    }

    this._hide(this._item, () => {
      this._remove()
      this._notify('after-remove', event)
    })
  }

  // Dynamic nodes are plainly removed from document, so we need to trigger
  // events on their parent and memoize it so we still can find it after removal
  get _notified () {
    if (typeof this.#notified === 'undefined') {
      this.#notified = this._item.parentElement
    }

    return this.#notified
  }

  _remove () {
    this._trigger.matches('.dynamic') ? this._item.remove() : this._markForDestruction()
  }

  _markForDestruction () {
    this._item.querySelectorAll('input[required], select[required]').forEach(input => input.removeAttribute('required'))
    this._item.querySelector('input[type=hidden][name$="[_destroy]"]').setAttribute('value', 'true')
  }
}

export { Remove }
