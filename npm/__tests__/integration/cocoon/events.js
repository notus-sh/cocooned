/* global given */

import Cocooned from '@notus.sh/cocooned'
import { jest } from '@jest/globals'
import { clickEvent, getAddLink, getRemoveLink } from '@cocooned/tests/support/helpers'

describe('A Cocoon setup using Cocoon events', () => {
  beforeEach(() => {
    document.body.innerHTML = given.html
    given.cocooned.start()
  })

  given('html', () => `
    <section>
      ${given.template}

      <div>
        <a data-cocooned-trigger="add" href="#"
           data-association="items"
           data-template="template">Add</a>
        <template data-name="template">${given.template}</template>
      </div>
    </section>
  `)
  given('template', () => `
    <div data-cocooned-item>
      <a data-cocooned-trigger="remove" class="dynamic" href="#">Remove</a>
    </div>
  `)
  given('container', () => document.querySelector('section'))
  given('cocooned', () => new Cocooned(given.container))
  given('addLink', () => getAddLink(given.container))

  describe('when add link is clicked', () => {
    it('fires a before-insert event', () => {
      const listener = jest.fn()
      given.container.addEventListener('cocoon:before-insert', listener)
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
        given.container.addEventListener('cocoon:before-remove', listener)
        given.removeLink.dispatchEvent(clickEvent())

        expect(listener).toHaveBeenCalled()
      })
    })
  })
})
