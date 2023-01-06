import $ from 'jquery'
import { Base } from './src/cocooned/base'
import { limitMixin, reorderableMixin } from './src/cocooned/plugins'
import { jQueryPluginMixin } from './src/integrations/jquery/mixins'

class Cocooned extends reorderableMixin(limitMixin(Base)) {
  static create (container, options) {
    if ('cocooned' in container.dataset) {
      return
    }

    return new Cocooned(container, options)
  }

  static start () {
    document.querySelectorAll('*[data-cocooned-options]').forEach(element => Cocooned.create(element))
  }
}

// Expose a jQuery plugin
jQueryPluginMixin($, Cocooned)

// On-load initialization
$(() => Cocooned.start())

export default Cocooned
