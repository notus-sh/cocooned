/* global given */

import Cocooned from '@notus.sh/cocooned/cocooned'
import { faker } from '@cocooned/tests/support/faker'
import { setup, asAttribute, clickEvent } from '@cocooned/tests/support/helpers'
import { getItems, getAddLink, getRemoveLink } from '@cocooned/tests/support/selectors'

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
  given('insertionTemplate', () => '<div class="cocooned-item"></div>')
  given('existing', () => '')
  given('container', () => document.querySelector('section'))
  given('cocooned', () => new Cocooned(given.container, { limit: given.limit }))
  given('items', () => getItems(given.container))
  given('addLink', () => getAddLink(given.container))

  beforeEach(() => setup(document, given))

  describe('with options for the limit plugin', () => {
    given('limit', () => faker.datatype.number({ min: 2, max: 5 }))

    it('limits how many items can be added to the container', () => {
      for (let i = 0; i <= given.limit; i++) {
        given.addLink.dispatchEvent(clickEvent())
      }

      expect(given.items.length).toEqual(given.limit)
    })

    describe('with already existing elements', () => {
      given('existing', () => `
        <div class="cocooned-item">
          <input type="hidden" name="list[items_attributes][0][_destroy]" />
          <a class="cocooned-remove existing" href="#">Remove</a>
        </div>
      `)

      it('limits total number of items the container can hold', () => {
        for (let i = 0; i <= given.limit; i++) {
          given.addLink.dispatchEvent(clickEvent())
        }

        expect(given.items.length).toEqual(given.limit)
      })

      describe('when removed', () => {
        given('removeLink', () => getRemoveLink(given.container))

        it('limits total number of visible items in the container', () => {
          given.removeLink.dispatchEvent(clickEvent())
          for (let i = 0; i <= given.limit; i++) {
            given.addLink.dispatchEvent(clickEvent())
          }

          expect(given.items.length).toEqual(given.limit + 1)
        })
      })
    })
  })
})
