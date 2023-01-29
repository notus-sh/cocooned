import { Base } from './src/cocooned/base'
import { limitMixin } from './src/cocooned/plugins/limit'
import { reorderableMixin } from './src/cocooned/plugins/reorderable'
import { CocoonSupportMixin } from './src/integrations/cocoon'

class Cocooned extends CocoonSupportMixin(reorderableMixin(limitMixin(Base))) {
  static create (container, options = {}) {
    const cocooned = new Cocooned(container, options)
    cocooned.start()

    return cocooned
  }

  static start () {
    document.querySelectorAll('*[data-cocooned-options]').forEach(element => Cocooned.create(element))
  }
}

export default Cocooned
