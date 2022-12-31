/* global given, delegate, abnegate */

import Cocooned from '@notus.sh/cocooned/cocooned'
import { jest } from '@jest/globals'
import { setup, clickEvent } from '@cocooned/tests/support/helpers'

describe('A Cocoon setup using Cocoon classes', () => {
  given('template', () => `
    <section>
      ${given.existing}

      <div>
        <a class="add_fields" href="#"
           data-association="items"
           data-template="template">Add</a>
        <template data-name="template">${given.insertionTemplate}</template>
      </div>
    </section>
  `)
  given('insertionTemplate', () => `
    <div class="nested-fields">
      <a class="remove_fields dynamic" href="#">Remove</a>
    </div>
  `)
  given('existing', () => given.insertionTemplate)
  given('container', () => document.querySelector('section'))
  given('cocooned', () => new Cocooned(given.container))
  given('addLink', () => given.container.querySelector('.add_fields'))

  beforeEach(() => setup(document, given))

  describe('when add link is clicked', () => {
    beforeEach(() => delegate('cocooned:before-insert'))
    afterEach(() => abnegate('cocooned:before-insert'))

    it('fires a before-insert event', () => {
      const listener = jest.fn()
      given.container.addEventListener('$cocooned:before-insert', listener)
      given.addLink.dispatchEvent(clickEvent())

      expect(listener).toHaveBeenCalled()
    })
  })

  describe('with an item', () => {
    beforeEach(() => given.addLink.dispatchEvent(clickEvent()))

    describe('when remove link is clicked', () => {
      beforeEach(() => delegate('cocooned:before-remove'))
      afterEach(() => abnegate('cocooned:before-remove'))

      given('removeLink', () => given.container.querySelector('.remove_fields'))

      it('fires a before-remove event', () => {
        const listener = jest.fn()
        given.container.addEventListener('$cocooned:before-remove', listener)
        given.removeLink.dispatchEvent(clickEvent())

        expect(listener).toHaveBeenCalled()
      })
    })
  })
})
