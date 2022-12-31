/* global given, delegate, abnegate */

import Cocooned from '@notus.sh/cocooned/cocooned'
import { jest } from '@jest/globals'
import { setup, asAttribute, clickEvent } from '@cocooned/tests/support/helpers'
import { getAddLink, getRemoveLink } from '@cocooned/tests/support/selectors'

describe('A Cocoon setup using Cocoon events', () => {
  given('template', () => `
    <section>
      ${given.existing}

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
      <a class="cocooned-remove dynamic" href="#">Remove</a>
    </div>
  `)
  given('existing', () => given.insertionTemplate)
  given('container', () => document.querySelector('section'))
  given('cocooned', () => new Cocooned(given.container))
  given('addLink', () => getAddLink(given.container))

  beforeEach(() => setup(document, given))

  describe('when add link is clicked', () => {
    beforeEach(() => delegate('cocoon:before-insert'))
    afterEach(() => abnegate('cocoon:before-insert'))

    it('fires a before-insert event', () => {
      const listener = jest.fn()
      given.container.addEventListener('$cocoon:before-insert', listener)
      given.addLink.dispatchEvent(clickEvent())

      expect(listener).toHaveBeenCalled()
    })
  })

  describe('with an item', () => {
    beforeEach(() => given.addLink.dispatchEvent(clickEvent()))

    describe('when remove link is clicked', () => {
      beforeEach(() => delegate('cocoon:before-remove'))
      afterEach(() => abnegate('cocoon:before-remove'))

      given('removeLink', () => getRemoveLink(given.container))

      it('fires a before-remove event', () => {
        const listener = jest.fn()
        given.container.addEventListener('$cocoon:before-remove', listener)
        given.removeLink.dispatchEvent(clickEvent())

        expect(listener).toHaveBeenCalled()
      })
    })
  })
})
