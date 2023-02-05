/* global given */

import { cocoonSupportMixin } from '@notus.sh/cocooned/src/integrations/cocoon'
import { Cocooned } from '@notus.sh/cocooned/src/cocooned/cocooned'

describe('cocoonSupportMixin', () => {
  given('extended', () => cocoonSupportMixin(Cocooned))

  describe('eventNamespaces', () => {
    it('add cocoon event namespace', () => {
      expect(given.extended.eventNamespaces).toContain('cocoon')
    })
  })

  describe('selectors', () => {
    it('add cocoon item selector', () => {
      expect(given.extended.selectors['item']).toContain('.nested-fields')
    })

    it('add cocoon add trigger selector', () => {
      expect(given.extended.selectors['triggers.add']).toContain('.add_fields')
    })

    it('add cocoon remove trigger selector', () => {
      expect(given.extended.selectors['triggers.remove']).toContain('.remove_fields')
    })
  })
})
