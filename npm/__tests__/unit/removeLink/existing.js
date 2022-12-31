/* global given */

import Cocooned from '@notus.sh/cocooned/cocooned'
import { setup, asAttribute, clickEvent } from '@cocooned/tests/support/helpers'
import { getItems, getItem, getRemoveLink } from '@cocooned/tests/support/selectors'

describe('A Cocooned setup', () => {
  given('template', () => `
    <section>
      ${given.existing}
      
      <div>
        <a class="cocooned-add" href="#"
           data-association="items"
           data-template-id="template">Add</a>
        <template id="template">${given.insertionTemplate}</template>
      </div>
    </section>
  `)
  given('insertionTemplate', () => `
    <div class="cocooned-item">
      <a class="cocooned-remove dynamic" href="#">Remove</a>
    </div>
  `)
  given('container', () => document.querySelector('section'))
  given('cocooned', () => new Cocooned(given.container))
  given('item', () => getItem(given.container))

  beforeEach(() => setup(document, given))

  describe('with existing item', () => {
    beforeEach(() => {
      given.removeLink.dispatchEvent(clickEvent())
    })

    given('existing', () => `
      <div class="cocooned-item">
        <input type="hidden" name="list[items_attributes][0][_destroy]" />
        <a class="cocooned-remove existing" href="#">Remove</a>
      </div>
    `)
    given('removeLink', () => getRemoveLink(given.container))

    it('does not remove the item from the container', () => {
      expect(getItems(given.container).length).toEqual(1)
    })

    it('hides the item', () => {
      expect(given.item).not.toBeVisible()
    })

    it('sets _destroy value', () => {
      expect(given.item.querySelector('input[name$="[_destroy]"]').getAttribute('value')).toBeTruthy()
    })

    describe('with required input', () => {
      given('existing', () => `
        <div class="cocooned-item">
          <input type="hidden" name="list[items_attributes][0][_destroy]" />
          <a class="cocooned-remove existing" href="#">Remove</a>
          
          <input type="text" name="list[items_attributes][0][name]" required />
          <select name="list[items_attributes][0][priority]" required>
            <option value="0">Low</option>
            <option value="1">Medium</option>
            <option value="2">High</option>
          </select>
        </div>
      `)
      given('inputs', () => given.item.querySelectorAll('input, select, textarea'))

      it('removes required attribute on every input', () => {
        const requireds = Array.from(given.inputs).map(input => input.getAttribute('required'))

        expect([...new Set(requireds)]).toEqual([null])
      })
    })
  })
})
