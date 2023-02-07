import { Cocooned as Base } from './src/cocooned/cocooned'
import { limitMixin } from './src/cocooned/plugins/limit'
import { reorderableMixin } from './src/cocooned/plugins/reorderable'
import { cocoonSupportMixin } from './src/integrations/cocoon'

class Cocooned extends reorderableMixin(limitMixin(cocoonSupportMixin(Base))) {
  static create (container, options = {}) {
    if ('cocoonedUuid' in container.dataset) {
      return Cocooned.getInstance(container.dataset.cocoonedUuid)
    }

    const cocooned = new Cocooned(container, options)
    cocooned.start()

    return cocooned
  }

  static start () {
    document.querySelectorAll('[data-cocooned-container], [data-cocooned-options]')
      .forEach(element => Cocooned.create(element))
  }
}

export default Cocooned
