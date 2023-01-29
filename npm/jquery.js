/* global jQuery, $ */
import Cocooned from './index'
import { jQueryPluginMixin } from './src/integrations/jquery'

// Expose a jQuery plugin
jQueryPluginMixin(jQuery, Cocooned)

// On-load initialization
const cocoonedAutoStart = () => Cocooned.start()
$(cocoonedAutoStart)

export default Cocooned
export {
  cocoonedAutoStart
}
