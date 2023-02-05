/* global jQuery, $ */
import Cocooned from './index'
import { jQueryPluginMixin } from './src/integrations/jquery'
import { cocoonAutoStart } from './src/integrations/cocoon'

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
