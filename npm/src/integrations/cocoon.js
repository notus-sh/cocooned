const CocoonSupportMixin = (Base) => class extends Base {
  static eventNamespaces () {
    return [...super.eventNamespaces(), 'cocoon']
  }
}

export {
  CocoonSupportMixin
}
