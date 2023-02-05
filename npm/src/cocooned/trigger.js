class Trigger {
  constructor (trigger, cocooned) {
    this._trigger = trigger
    this._cocooned = cocooned
  }

  get trigger () {
    return this._trigger
  }

  handle (event) {
    throw new TypeError('handle() must be defined in subclasses')
  }

  /* Protected and private attributes and methods */
  _cocooned
  _trigger

  get _item () {
    return this._cocooned.selection.toItem(this._trigger)
  }

  get _notified () {
    return this._item
  }

  _notify (eventName, originalEvent) {
    return this._cocooned.notify(this._notified, eventName, this._eventData(originalEvent))
  }

  _eventData (originalEvent) {
    return { link: this._trigger, node: this._item, cocooned: this._cocooned, originalEvent }
  }

  _hide (node, callback) {
    return this._cocooned.hide(node, callback)
  }

  _show (node, callback) {
    return this._cocooned.show(node, callback)
  }
}

export {
  Trigger
}
