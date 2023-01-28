/* global given */

import { Base as Cocooned } from '@notus.sh/cocooned/src/cocooned/base'
import { Up, Down } from '@notus.sh/cocooned/src/cocooned/plugins/reorderable/triggers'
import { jest } from '@jest/globals'
import { faker } from '@cocooned/tests/support/faker'
import { clickEvent } from '@cocooned/tests/support/helpers'
import { getItems, getMoveUpLink, getMoveDownLink } from '@cocooned/tests/support/selectors'

import itBehavesLikeAnEventListener from "@cocooned/tests/shared/events/customListener"
import itBehavesLikeACancellableEvent from "@cocooned/tests/shared/events/cancelable"

describe('Move', () => {
  beforeEach(() => document.body.innerHTML = given.html)

  given('container', () => document.querySelector('.cocooned-container'))
  given('count', () => faker.datatype.number({ min: 2, max: 5 }))
  given('template', () => `
    <div class="cocooned-item">
      <a class="cocooned-move-up" href="#">Up</a>
      <a class="cocooned-move-down" href="#">Down</a>
      <input type="hidden" name="items[0][position]" />
    </div>
  `)
  given('html', () => `
    <div class="cocooned-container">
      ${Array.from(Array(given.count), () => given.template).join("\n")}
    </div>
  `)

  const itBehavesLikeASingleMoveTrigger = () => {
    it('does not change item position', () => {
      given.move.handle(clickEvent())

      const items = getItems(given.container)
      const item = given.moveTrigger.closest('.cocooned-item')
      const index = Array.from(items).findIndex(i => i === item)

      expect(index).toEqual(given.index)
    })

    describe('a before-move event', () => {
      it('is not triggered', () => {
        const listener = jest.fn()
        given.container.addEventListener('cocooned:before-move', listener)
        given.move.handle(clickEvent())

        expect(listener).not.toHaveBeenCalled()
      })
    })

    describe('an after-move event', () => {
      it('is not triggered', () => {
        const listener = jest.fn()
        given.container.addEventListener('cocooned:after-move', listener)
        given.move.handle(clickEvent())

        expect(listener).not.toHaveBeenCalled()
      })
    })
  }

  const itBehavesLikeAMoveTrigger = () => {
    describe('a before-move event', () => {
      it('is triggered', () => {
        const listener = jest.fn()
        given.container.addEventListener('cocooned:before-move', listener)
        given.move.handle(clickEvent())

        expect(listener).toHaveBeenCalled()
      })

      itBehavesLikeAnEventListener({
        listen: (listener) => given.container.addEventListener('cocooned:before-move', listener),
        dispatch: () => given.move.handle(clickEvent())
      })
    })

    describe('an after-move event', () => {
      it('is triggered', () => {
        const listener = jest.fn()
        given.container.addEventListener('cocooned:after-move', listener)
        given.move.handle(clickEvent())

        expect(listener).toHaveBeenCalled()
      })

      itBehavesLikeAnEventListener({
        listen: (listener) => given.container.addEventListener('cocooned:after-move', listener),
        dispatch: () => given.move.handle(clickEvent())
      })
    })

    itBehavesLikeACancellableEvent({
      event: 'move',
      dispatch: () => { given.move.handle(clickEvent()) }
    })
  }

  describe('Up', () => {
    given('moveTrigger', () => getMoveUpLink(given.container, given.index))
    given('move', () => new Up(given.moveTrigger, new Cocooned(given.container)))

    describe('handle', () => {
      describe('without a pivot item', () => {
        given('index', () => 0)

        itBehavesLikeASingleMoveTrigger()
      })

      describe('with a pivot item', () => {
        given('index', () => faker.datatype.number({ min: 1, max: given.count - 1 }))

        it('moves item up', () => {
          given.move.handle(clickEvent())

          const items = getItems(given.container)
          const item = given.moveTrigger.closest('.cocooned-item')
          const index = Array.from(items).findIndex(i => i === item)

          expect(index).toEqual(given.index - 1)
        })

        itBehavesLikeAMoveTrigger()
      })
    })
  })

  describe('Down', () => {
    given('moveTrigger', () => getMoveDownLink(given.container, given.index))
    given('move', () => new Down(given.moveTrigger, new Cocooned(given.container)))

    describe('handle', () => {
      describe('without a pivot item', () => {
        given('index', () => given.count - 1)

        itBehavesLikeASingleMoveTrigger()
      })

      describe('with a pivot item', () => {
        given('index', () => faker.datatype.number({ min: 0, max: given.count - 2 }))

        it('moves item down', () => {
          given.move.handle(clickEvent())

          const items = getItems(given.container)
          const item = given.moveTrigger.closest('.cocooned-item')
          const index = Array.from(items).findIndex(i => i === item)

          expect(index).toEqual(given.index + 1)
        })

        itBehavesLikeAMoveTrigger()
      })
    })
  })
})
