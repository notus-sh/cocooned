/* global given */

import Cocooned from '@notus.sh/cocooned'
import { jest } from '@jest/globals'
import { clickEvent } from '@cocooned/tests/support/helpers'

describe('A Cocoon setup using Cocoon classes', () => {
  beforeEach(() => {
    document.body.innerHTML = given.html
    given.cocooned.start()
  })

  given('html', () => `
    <section>
      ${given.template}

      <div>
        <a class="add_fields" href="#"
           data-association="items"
           data-template="template">Add</a>
        <template data-name="template">${given.template}</template>
      </div>
    </section>
  `)
  given('template', () => `
    <div class="nested-fields">
      <a class="remove_fields dynamic" href="#">Remove</a>
    </div>
  `)
  given('container', () => document.querySelector('section'))
  given('cocooned', () => new Cocooned(given.container))
  given('addLink', () => given.container.querySelector('.add_fields'))

  describe('when add link is clicked', () => {
    it('fires a before-insert event', () => {
      const listener = jest.fn()
      given.container.addEventListener('cocooned:before-insert', listener)
      given.addLink.dispatchEvent(clickEvent())

      expect(listener).toHaveBeenCalled()
    })
  })

  describe('with an item', () => {
    beforeEach(() => given.addLink.dispatchEvent(clickEvent()))

    describe('when remove link is clicked', () => {
      given('removeLink', () => given.container.querySelector('.remove_fields'))

      it('fires a before-remove event', () => {
        const listener = jest.fn()
        given.container.addEventListener('cocooned:before-remove', listener)
        given.removeLink.dispatchEvent(clickEvent())

        expect(listener).toHaveBeenCalled()
      })
    })
  })
})
