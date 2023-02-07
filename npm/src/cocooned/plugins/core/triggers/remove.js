import { Trigger } from '../../../trigger'

class Remove extends Trigger {
  handle (event) {
    // Removal can be prevented through a 'cocooned:before-remove' event handler
    if (!this._notify('before-remove', event)) {
      return false
    }

    this._hide(this._item, () => {
      this._remove()
      this._notify('after-remove', event)
    })
  }

  /* Protected and private attributes and methods */
  #notified

  // Dynamic nodes are plainly removed from document, so we need to trigger
  // events on their parent and memoize it so we still can find it after removal
  get _notified () {
    if (typeof this.#notified === 'undefined') {
      this.#notified = this._item.parentElement
    }

    return this.#notified
  }

  _remove () {
    this._removable() ? this._item.remove() : this._markForDestruction()
  }

  _removable () {
    return this._trigger.matches('.dynamic') ||
      ('cocoonedPersisted' in this._trigger.dataset && this._trigger.dataset.cocoonedPersisted === 'false')
  }

  _markForDestruction () {
    this._item.querySelector('input[type=hidden][name$="[_destroy]"]').setAttribute('value', 'true')
    this._item.querySelectorAll('input[required], select[required]')
      .forEach(input => input.removeAttribute('required'))
  }
}

export { Remove }
