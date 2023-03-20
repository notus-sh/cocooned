/* global jQuery, $ */
import Cocooned from './index.js'
import { jQueryPluginMixin } from './src/integrations/jquery.js'
import { cocoonAutoStart } from './src/integrations/cocoon.js'

// Expose a jQuery plugin
jQueryPluginMixin(jQuery, Cocooned)

// On-load initialization
const cocoonedAutoStart = () => Cocooned.start()
$(cocoonedAutoStart)

$(() => cocoonAutoStart($))

export default Cocooned
export {
  cocoonedAutoStart
}
