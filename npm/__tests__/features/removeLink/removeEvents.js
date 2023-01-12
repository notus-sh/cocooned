/* global given */

import Cocooned from '@notus.sh/cocooned/cocooned'
import { jest } from '@jest/globals'
import { setup, clickEvent } from '@cocooned/tests/support/helpers'
import { getItem, getRemoveLink } from '@cocooned/tests/support/selectors'

import itBehavesLikeAnEventListener from '@cocooned/tests/shared/events/listener'
import itBehavesLikeACancellableEvent from '@cocooned/tests/shared/events/cancelable'

describe('A Cocooned setup', () => {
  given('template', () => `
    <section>
      ${given.insertionTemplate}
      
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
  given('container', () => document.querySelector('section'))
  given('cocooned', () => new Cocooned(given.container))
  given('removeLink', () => getRemoveLink(given.container))
  given('item', () => getItem(given.container))

  beforeEach(() => setup(document, given))

  describe('events on remove', () => {
    describe('a before-remove event', () => {
      it('is triggered', () => {
        const listener = jest.fn()
        given.container.addEventListener('cocooned:before-remove', listener)
        given.removeLink.dispatchEvent(clickEvent())

        expect(listener).toHaveBeenCalled()
      })

      itBehavesLikeAnEventListener({
        listen: (listener) => given.container.addEventListener('cocooned:before-remove', listener),
        dispatch: () => given.removeLink.dispatchEvent(clickEvent())
      })
    })

    describe('an after-remove event', () => {
      it('is triggered', () => {
        const listener = jest.fn()
        given.container.addEventListener('cocooned:after-remove', listener)
        given.removeLink.dispatchEvent(clickEvent())

        expect(listener).toHaveBeenCalled()
      })

      itBehavesLikeAnEventListener({
        listen: (listener) => given.container.addEventListener('cocooned:after-remove', listener),
        dispatch: () => given.removeLink.dispatchEvent(clickEvent())
      })
    })

    itBehavesLikeACancellableEvent({
      event: 'remove',
      dispatch: () => { given.removeLink.dispatchEvent(clickEvent()) }
    })
  })
})