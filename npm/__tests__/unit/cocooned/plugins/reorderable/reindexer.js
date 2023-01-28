/* global given */

import { Reindexer } from '@notus.sh/cocooned/src/cocooned/plugins/reorderable/reindexer'
import { Base as Cocooned } from '@notus.sh/cocooned/src/cocooned/base'
import { jest } from '@jest/globals'
import { faker } from '@cocooned/tests/support/faker'
import { setup, asInt, clickEvent } from '@cocooned/tests/support/helpers'
import { getItems } from '@cocooned/tests/support/selectors'

import itBehavesLikeAnEventListener from "@cocooned/tests/shared/events/customListener"
import itBehavesLikeACancellableEvent from "@cocooned/tests/shared/events/cancelable"

describe('Reindexer', () => {
  beforeEach(() => document.body.innerHTML = given.html)

  given('reindexer', () => new Reindexer(given.cocooned))
  given('cocooned', () => new Cocooned(given.container))
  given('container', () => document.querySelector('.cocooned-container'))
  given('count', () => faker.datatype.number({ min: 2, max: 5 }))
  given('item', () => faker.helpers.arrayElement(Array.from(getItems(given.container))))
  given('template', () => `
    <div class="cocooned-item">
      <input type="hidden" name="items[0][position]" />
    </div>
  `)
  given('html', () => `
    <div class="cocooned-container">
      ${Array.from(Array(given.count), () => given.template).join('')}
    </div>
  `)

  describe('reindex', () => {
    it('updates position fields', () => {
      given.reindexer.reindex(clickEvent())

      const inputs = given.container.querySelectorAll('input[name$="[position]"]')
      const positions = Array.from(inputs).map(input => asInt(input.getAttribute('value')))
      expect(positions).toEqual(Array.from(Array(given.count), (_, i) => i))
    })

    it('ignores hidden items', () => {
      given.cocooned.hide(given.item)
      given.reindexer.reindex(clickEvent())

      const items = Array.from(getItems(given.container)).filter(item => (item != given.item))
      const inputs = items.map(item => item.querySelector('input[name$="[position]"]'))
      const positions = Array.from(inputs).map(input => asInt(input.getAttribute('value')))

      expect(positions).toEqual(Array.from(Array(given.count - 1), (_, i) => i))
    })

    describe('a before-insert event', () => {
      it('is triggered', () => {
        const listener = jest.fn()
        given.container.addEventListener('cocooned:before-reindex', listener)
        given.reindexer.reindex(clickEvent())

        expect(listener).toHaveBeenCalled()
      })

      itBehavesLikeAnEventListener({
        listen: (listener) => given.container.addEventListener('cocooned:before-reindex', listener),
        dispatch: () => given.reindexer.reindex(clickEvent()),
        args: new Set(['nodes', 'cocooned'])
      })
    })

    describe('an after-insert event', () => {
      it('is triggered', () => {
        const listener = jest.fn()
        given.container.addEventListener('cocooned:after-reindex', listener)
        given.reindexer.reindex(clickEvent())

        expect(listener).toHaveBeenCalled()
      })

      itBehavesLikeAnEventListener({
        listen: (listener) => given.container.addEventListener('cocooned:after-reindex', listener),
        dispatch: () => given.reindexer.reindex(clickEvent()),
        args: new Set(['nodes', 'cocooned'])
      })
    })

    itBehavesLikeACancellableEvent({
      event: 'reindex',
      dispatch: () => given.reindexer.reindex(clickEvent())
    })

    describe('with startAt', () => {
      given('reindexer', () => new Reindexer(given.cocooned, given.startAt))
      given('startAt', () => faker.datatype.number({ min: 2, max: 5 }))

      it('updates position fields', () => {
        given.reindexer.reindex(clickEvent())

        const inputs = given.container.querySelectorAll('input[name$="[position]"]')
        const positions = Array.from(inputs).map(input => asInt(input.getAttribute('value')))
        expect(positions).toEqual(Array.from(Array(given.count), (_, i) => i + given.startAt))
      })
    })
  })
})
