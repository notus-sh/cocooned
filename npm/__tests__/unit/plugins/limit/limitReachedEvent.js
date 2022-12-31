/* global given, delegate, abnegate */

import Cocooned from '@notus.sh/cocooned/cocooned'
import { jest } from '@jest/globals'
import { setup, clickEvent } from '@cocooned/tests/support/helpers'
import { getItems, getAddLink } from '@cocooned/tests/support/selectors'

import itBehavesLikeAnEventListener from '@cocooned/tests/unit/shared/events/listener'

describe('A Cocooned setup', () => {
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
  given('insertionTemplate', () => '<div class="cocooned-item"></div>')
  given('existing', () => given.insertionTemplate)
  given('container', () => document.querySelector('section'))
  given('cocooned', () => new Cocooned(given.container, { limit: 1 }))
  given('items', () => getItems(given.container))
  given('addLink', () => getAddLink(given.container))

  beforeEach(() => setup(document, given))

  describe('when limit is reached', () => {
    beforeEach(() => delegate('cocooned:limit-reached', ['event', 'node', 'cocooned']))
    afterEach(() => abnegate('cocooned:limit-reached'))

    describe('a coconned:limit-reached event', () => {
      it('is triggered', () => {
        const listener = jest.fn()
        given.container.addEventListener('$cocooned:limit-reached', listener)
        given.addLink.dispatchEvent(clickEvent())

        expect(listener).toHaveBeenCalled()
        given.container.removeEventListener('$cocooned:limit-reached', listener)
      })

      itBehavesLikeAnEventListener({
        listen: (listener) => given.container.addEventListener('$cocooned:limit-reached', listener),
        dispatch: () => given.addLink.dispatchEvent(clickEvent())
      })
    })
  })
})
