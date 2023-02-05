const cocoonSupportMixin = (Base) => class extends Base {
  static get eventNamespaces () {
    return [...super.eventNamespaces, 'cocoon']
  }

  static get selectors () {
    const selectors = super.selectors
    selectors['item'].push('.nested-fields')
    selectors['triggers.add'].push('.add_fields')
    selectors['triggers.remove'].push('.remove_fields')

    return selectors
  }
}

export {
  cocoonSupportMixin
}
