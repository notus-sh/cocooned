import $ from 'jquery'
import { Base } from './src/cocooned/base'
import { limitMixin, reorderableMixin } from './src/cocooned/plugins'

class Cocooned extends reorderableMixin(limitMixin(Base)) {}

// Expose a jQuery plugin
$.fn.cocooned = function (options) {
  return this.each(function () {
    if (typeof $(this).data('cocooned') !== 'undefined') {
      return
    }

    return new Cocooned(this, options)
  })
}

// On-load initialization
$(() => $('*[data-cocooned-options]').each((_i, el) => $(el).cocooned()))

export default Cocooned
