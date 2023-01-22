class Base {
  _cocooned
  _trigger

  constructor (trigger, cocooned) {
    this._trigger = trigger
    this._cocooned = cocooned
  }

  handle (event) {
    throw new TypeError('handle() must be defined in subclasses')
  }

  get _node () {
    return this._trigger.closest('.cocooned-item')
  }

  get _notified () {
    return this._node
  }

  _notify (eventName, originalEvent) {
    return this._cocooned.notify(this._notified, eventName, this._eventData(originalEvent))
  }

  _eventData (originalEvent) {
    return { link: this._trigger, node: this._node, cocooned: this._cocooned, originalEvent }
  }

  _hide (node, callback) {
    return this._cocooned.hide(node, callback)
  }

  _show (node, callback) {
    return this._cocooned.show(node, callback)
  }
}

export default Base
