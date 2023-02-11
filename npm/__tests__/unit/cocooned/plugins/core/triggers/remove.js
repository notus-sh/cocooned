/* global given */

import { Base as Cocooned } from '@notus.sh/cocooned/src/cocooned/base'
import { Remove } from '@notus.sh/cocooned/src/cocooned/plugins/core/triggers/remove'
import { jest } from '@jest/globals'
import { clickEvent, getItem, getItems, getRemoveLink } from '@cocooned/tests/support/helpers'

import itBehavesLikeAnEventListener from '@cocooned/tests/shared/events/listener'
import itBehavesLikeACancellableEvent from '@cocooned/tests/shared/events/cancelable'

describe('Remove', () => {
  beforeEach(() => { document.body.innerHTML = given.html })

  given('remove', () => new Remove(given.removeTrigger, new Cocooned(given.container)))
  given('removeTrigger', () => getRemoveLink(given.container))
  given('container', () => document.querySelector('[data-cocooned-container]'))
  given('item', () => getItem(given.container))
  given('html', () => `
    <div data-cocooned-container>
      <div data-cocooned-item>
        <a data-cocooned-trigger="remove" data-cocooned-persisted="false" href="#">Remove</a>
      </div>
    </div>
  `)

  const itBehavesLikeARemoteTrigger = () => {
    describe('a before-remove event', () => {
      it('is triggered', () => {
        const listener = jest.fn()
        given.container.addEventListener('cocooned:before-remove', listener)
        given.remove.handle(clickEvent())

        expect(listener).toHaveBeenCalled()
      })

      itBehavesLikeAnEventListener({
        listen: (listener) => given.container.addEventListener('cocooned:before-remove', listener),
        dispatch: () => given.remove.handle(clickEvent())
      })
    })

    describe('an after-remove event', () => {
      it('is triggered', async () => {
        const listener = jest.fn()
        given.container.addEventListener('cocooned:after-remove', listener)
        given.remove.handle(clickEvent())
        await new Promise(process.nextTick)

        expect(listener).toHaveBeenCalled()
      })

      itBehavesLikeAnEventListener({
        listen: (listener) => given.container.addEventListener('cocooned:after-remove', listener),
        dispatch: () => given.remove.handle(clickEvent())
      })
    })

    itBehavesLikeACancellableEvent({
      event: 'remove',
      dispatch: () => { given.remove.handle(clickEvent()) }
    })
  }

  describe('handle', () => {
    describe('with a dynamic item', () => {
      it('remove item from document', async () => {
        given.remove.handle(clickEvent())
        await new Promise(process.nextTick)

        expect(getItems(given.container)).toHaveLength(0)
      })

      itBehavesLikeARemoteTrigger()
    })

    describe('with an existing item', () => {
      given('html', () => `
        <div data-cocooned-container>
          <div data-cocooned-item>
            <input type="hidden" name="items[0][_destroy]" required />
            <a data-cocooned-trigger="remove" data-cocooned-persisted="true" href="#">Remove</a>
          </div>
        </div>
      `)

      it('does not remove item from document', async () => {
        given.remove.handle(clickEvent())
        await new Promise(process.nextTick)

        expect(getItems(given.container)).toHaveLength(1)
      })

      it('hides item', async () => {
        given.remove.handle(clickEvent())
        await new Promise(process.nextTick)

        expect(given.item.style?.display).toEqual('none')
      })

      it('marks item for destruction', async () => {
        given.remove.handle(clickEvent())
        await new Promise(process.nextTick)

        expect(given.item.querySelector('input').getAttribute('value')).toBeTruthy()
      })

      it('removes required on inputs', async () => {
        given.remove.handle(clickEvent())
        await new Promise(process.nextTick)

        expect(given.item.querySelector('input').getAttributeNames()).not.toContain('required')
      })

      itBehavesLikeARemoteTrigger()
    })
  })
})
