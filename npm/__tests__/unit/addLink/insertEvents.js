/* global given, delegate, abnegate */

import Cocooned from '@notus.sh/cocooned/cocooned'
import { jest } from '@jest/globals'
import { setup, asAttribute, clickEvent } from '@cocooned/tests/support/helpers'
import { getItem, getAddLink } from '@cocooned/tests/support/selectors'

import itBehavesLikeAnEventListener from '@cocooned/tests/unit/shared/events/listener'
import itBehavesLikeACancellableEvent from '@cocooned/tests/unit/shared/events/cancelable'

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
  given('insertionTemplate', () => '<div class="cocooned-item"></div>')
  given('container', () => document.querySelector('section'))
  given('cocooned', () => new Cocooned(given.container))
  given('addLink', () => getAddLink(given.container))
  given('item', () => getItem(given.container))

  beforeEach(() => setup(document, given))

  describe('events on insert', () => {
    beforeEach(() => {
      delegate('cocooned:before-insert', ['event', 'node', 'cocooned'])
      delegate('cocooned:after-insert', ['event', 'node', 'cocooned'])
    })
    afterEach(() => {
      abnegate('cocooned:before-insert')
      abnegate('cocooned:after-insert')
    })

    describe('a before-insert event', () => {
      it('is triggered', () => {
        const listener = jest.fn()
        given.container.addEventListener('$cocooned:before-insert', listener)
        given.addLink.dispatchEvent(clickEvent())

        expect(listener).toHaveBeenCalled()
      })

      itBehavesLikeAnEventListener({
        listen: (listener) => given.container.addEventListener('$cocooned:before-insert', listener),
        dispatch: () => given.addLink.dispatchEvent(clickEvent())
      })
    })

    describe('an after-insert event', () => {
      it('is triggered', () => {
        const listener = jest.fn()
        given.container.addEventListener('$cocooned:after-insert', listener)
        given.addLink.dispatchEvent(clickEvent())

        expect(listener).toHaveBeenCalled()
      })

      itBehavesLikeAnEventListener({
        listen: (listener) => given.container.addEventListener('$cocooned:after-insert', listener),
        dispatch: () => given.addLink.dispatchEvent(clickEvent())
      })
    })

    itBehavesLikeACancellableEvent({
      event: 'insert',
      dispatch: () => { given.link.dispatchEvent(clickEvent()) },
      trigger: () => { $(given.link).trigger('click') }
    })
  })
})
