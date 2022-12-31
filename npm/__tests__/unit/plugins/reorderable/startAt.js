/* global given */

import Cocooned from '@notus.sh/cocooned/cocooned'
import { faker } from '@cocooned/tests/support/faker'
import { setup, asAttribute, asInt, clickEvent } from '@cocooned/tests/support/helpers'
import { getItems, getAddLink } from '@cocooned/tests/support/selectors'

describe('A Cocooned setup', () => {
  given('template', () => `
    <section>
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
      <input type="hidden" name="list[items_attributes][new_items][_destroy]" />
      <a class="cocooned-remove dynamic" href="#">Remove</a>
      <a class="cocooned-move-up" href="#">Up</a>
      <a class="cocooned-move-down" href="#">Down</a>
      
      <input type="hidden" name="list[items_attributes][new_items][position]" value="0" />
    </div>
  `)
  given('container', () => document.querySelector('section'))
  given('cocooned', () => new Cocooned(given.container, given.options))
  given('addLink', () => getAddLink(given.container))
  given('items', () => getItems(given.container))
  given('positions', () => Array.from(given.items).map(item => {
    return asInt(item.querySelector('input[name$="[position]"]').getAttribute('value'))
  }))

  beforeEach(() => setup(document, given))

  describe('with default options for the reorderable plugin', () => {
    given('options', () => { return { reorderable: true } })

    describe('when reindexing items', () => {
      it('reindex them starting at 1', () => {
        given.addLink.dispatchEvent(clickEvent())
        expect(given.positions).toEqual([1])
      })
    })
  })

  describe('with non default options for the reorderable plugin', () => {
    given('startAt', () => faker.datatype.number())
    given('options', () => { return { reorderable: { startAt: given.startAt } } })

    describe('when reindexing items', () => {
      it('reindex them starting at the expected position', () => {
        given.addLink.dispatchEvent(clickEvent())
        expect(given.positions).toEqual([given.startAt])
      })
    })
  })
})
