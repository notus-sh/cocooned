const jQueryPluginMixin = function (jQuery, Cocooned) {
  jQuery.fn.cocooned = function (options) {
    return this.each((_i, el) => Cocooned.create(el, options))
  }
}

export {
  jQueryPluginMixin
}
