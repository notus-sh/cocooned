/* global given, delegate, abnegate */

import Cocooned from '@notus.sh/cocooned/cocooned'
import { jest } from '@jest/globals'
import { setup, asAttribute, clickEvent } from '@cocooned/tests/support/helpers'
import { getItem, getRemoveLink } from '@cocooned/tests/support/selectors'

import itBehavesLikeAnEventListener from '@cocooned/tests/unit/shared/events/listener'
import itBehavesLikeACancellableEvent from '@cocooned/tests/unit/shared/events/cancelable'

describe('A Cocooned setup', () => {
  given('template', () => `
    <section>
      ${given.insertionTemplate}
      
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
  given('removeLink', () => getRemoveLink(given.container))
  given('item', () => getItem(given.container))

  beforeEach(() => setup(document, given))

  describe('events on remove', () => {
    beforeEach(() => {
      delegate('cocooned:before-remove', ['event', 'node', 'cocooned'])
      delegate('cocooned:after-remove', ['event', 'node', 'cocooned'])
    })
    afterEach(() => {
      abnegate('cocooned:before-remove')
      abnegate('cocooned:after-remove')
    })

    describe('a before-remove event', () => {
      it('is triggered', () => {
        const listener = jest.fn()
        given.container.addEventListener('$cocooned:before-remove', listener)
        given.removeLink.dispatchEvent(clickEvent())

        expect(listener).toHaveBeenCalled()
      })

      itBehavesLikeAnEventListener({
        listen: (listener) => given.container.addEventListener('$cocooned:before-remove', listener),
        dispatch: () => given.removeLink.dispatchEvent(clickEvent())
      })
    })

    describe('an after-remove event', () => {
      it('is triggered', () => {
        const listener = jest.fn()
        given.container.addEventListener('$cocooned:after-remove', listener)
        given.removeLink.dispatchEvent(clickEvent())

        expect(listener).toHaveBeenCalled()
      })

      itBehavesLikeAnEventListener({
        listen: (listener) => given.container.addEventListener('$cocooned:after-remove', listener),
        dispatch: () => given.removeLink.dispatchEvent(clickEvent())
      })
    })

    itBehavesLikeACancellableEvent({
      event: 'remove',
      dispatch: () => { given.removeLink.dispatchEvent(clickEvent()) },
      trigger: () => { $(given.removeLink).trigger('click') }
    })
  })
})
