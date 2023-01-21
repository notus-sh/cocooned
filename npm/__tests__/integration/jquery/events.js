/* global given */

import Cocooned from '@notus.sh/cocooned/cocooned'
import { jest } from '@jest/globals'
import { faker } from '@cocooned/tests/support/faker'
import { setup, clickEvent } from '@cocooned/tests/support/helpers'
import { getAddLink, getMoveDownLink, getMoveUpLink, getRemoveLink } from '@cocooned/tests/support/selectors'

describe('A Cocoon setup using jQuery events', () => {
  given('template', () => `
    <section data-cocooned-options='{"reorderable":true}'>
      <div>
        <a class="cocooned-add" href="#"
           data-association="items"
           data-template="template">Add</a>
        <template data-name="template">${given.insertionTemplate}</template>
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
  given('cocooned', () => new Cocooned(given.container))
  given('addLink', () => getAddLink(given.container))

  beforeEach(() => setup(document, given))

  describe('when add link is clicked', () => {
    it('fires a before-insert event', () => {
      const listener = jest.fn()
      $(given.container).on('cocoon:before-insert', listener)
      given.addLink.dispatchEvent(clickEvent())

      expect(listener).toHaveBeenCalled()
    })
  })

  describe('with an item', () => {
    beforeEach(() => given.addLink.dispatchEvent(clickEvent()))

    describe('when remove link is clicked', () => {
      given('removeLink', () => getRemoveLink(given.container))

      it('fires a before-remove event', () => {
        const listener = jest.fn()
        $(given.container).on('cocoon:before-remove', listener)
        given.removeLink.dispatchEvent(clickEvent())

        expect(listener).toHaveBeenCalled()
      })
    })
  })

  describe('with more than one item', () => {
    beforeEach(() => {
      for (let i = 0; i < given.count; i++) {
        given.addLink.dispatchEvent(clickEvent())
      }
    })

    given('count', () => faker.datatype.number({ min: 3, max: 5 }))
    given('index', () => faker.datatype.number({ min: 1, max: given.count - 2 }))

    describe('when move up link is clicked', () => {
      given('moveLink', () => getMoveUpLink(given.container, given.index))

      it('fires a before-move event', () => {
        const listener = jest.fn()
        $(given.container).on('cocooned:before-move', listener)
        given.moveLink.dispatchEvent(clickEvent())

        expect(listener).toHaveBeenCalled()
      })
    })

    describe('when move down link is clicked', () => {
      given('moveLink', () => getMoveDownLink(given.container, given.index))

      it('fires a before-move event', () => {
        const listener = jest.fn()
        $(given.container).on('cocooned:before-move', listener)
        given.moveLink.dispatchEvent(clickEvent())

        expect(listener).toHaveBeenCalled()
      })
    })
  })
})
