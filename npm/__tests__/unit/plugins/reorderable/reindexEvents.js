/* global given, delegate, abnegate */

import Cocooned from '@notus.sh/cocooned/cocooned'
import { jest } from '@jest/globals'
import { faker } from '@cocooned/tests/support/faker'
import { setup, asAttribute, clickEvent } from '@cocooned/tests/support/helpers'
import { getItems, getAddLink, getRemoveLink, getMoveUpLink, getMoveDownLink } from '@cocooned/tests/support/selectors'

import itBehavesLikeAnEventListener from '@cocooned/tests/unit/shared/events/listener'
import itBehavesLikeACancellableEvent from '@cocooned/tests/unit/shared/events/cancelable'

describe('A Cocooned setup', () => {
  given('template', () => `
    <section>
      ${given.existing}
      <div>
        <a class="cocooned-add" href="#"
           data-associations="items"
           data-association-insertion-template="${asAttribute(given.insertionTemplate)}">Add</a>
      </div>
    </section>
  `)
  given('insertionTemplate', () => `
    <div class="cocooned-item">
      <input type="hidden" name="list[items_attributes][new_items][_destroy]" />
      <a class="cocooned-remove dynamic" href="#">Remove</a>
      <a class="cocooned-move-up" href="#">Up</a>
      <a class="cocooned-move-down" href="#">Down</a>
      
      <input type="hidden" name="list[items_attributes][new_items][position]" value="0" />
    </div>
  `)
  given('count', () => faker.datatype.number({ min: 3, max: 8 }))
  given('existing', () => Array.from(Array(given.count), (_, i) => `
    <div class="cocooned-item">
      <input type="hidden" name="list[items_attributes][${i}][_destroy]" />
      <a class="cocooned-remove existing" href="#">Remove</a>
      <a class="cocooned-move-up" href="#">Up</a>
      <a class="cocooned-move-down" href="#">Down</a>
      
      <input type="hidden" name="list[items_attributes][${i}][position]" value="${i + 1}" />
    </div>
  `).join(''))
  given('container', () => document.querySelector('section'))
  given('cocooned', () => new Cocooned(given.container, { reorderable: true }))
  given('addLink', () => getAddLink(given.container))
  given('items', () => getItems(given.container))
  given('visibleItems', () => Array.from(given.items).filter(item => {
    return item.style.display !== 'none'
  }))

  beforeEach(() => setup(document, given))

  describe('with options for the reorderable plugin', () => {
    beforeEach(() => {
      delegate('cocooned:before-reindex', ['event', 'nodes', 'cocooned'])
      delegate('cocooned:after-reindex', ['event', 'nodes', 'cocooned'])
    })
    afterEach(() => {
      abnegate('cocooned:before-reindex')
      abnegate('cocooned:after-reindex')
    })

    const itBehavesLikeAReindexer = () => {
      beforeEach(() => jest.useFakeTimers())

      describe('a before-reindex event', () => {
        it('is triggered', () => {
          const listener = jest.fn()
          given.container.addEventListener('$cocooned:before-reindex', listener)
          given.link.dispatchEvent(clickEvent())
          jest.runAllTimers()

          expect(listener).toHaveBeenCalled()
          given.container.removeEventListener('$cocooned:before-reindex', listener)
        })

        itBehavesLikeAnEventListener({
          listen: (listener) => given.container.addEventListener('$cocooned:before-reindex', listener),
          dispatch: () => {
            given.link.dispatchEvent(clickEvent())
            jest.runAllTimers()
          },
          args: new Set(['event', 'nodes', 'cocooned'])
        })
      })

      describe('an after-reindex event', () => {
        it('is triggered', () => {
          const listener = jest.fn()
          given.container.addEventListener('$cocooned:after-reindex', listener)
          given.link.dispatchEvent(clickEvent())
          jest.runAllTimers()

          expect(listener).toHaveBeenCalled()
          given.container.removeEventListener('$cocooned:after-reindex', listener)
        })

        itBehavesLikeAnEventListener({
          listen: (listener) => given.container.addEventListener('$cocooned:after-reindex', listener),
          dispatch: () => {
            given.link.dispatchEvent(clickEvent())
            jest.runAllTimers()
          },
          args: new Set(['event', 'nodes', 'cocooned'])
        })
      })

      itBehavesLikeACancellableEvent({
        event: 'reindex',
        dispatch: () => {
          given.link.dispatchEvent(clickEvent())
          jest.runAllTimers()
        },
        trigger: () => {
          $(given.link).trigger('click')
          jest.runAllTimers()
        }
      })
    }

    describe('when adding an item', () => {
      given('link', () => given.addLink)

      itBehavesLikeAReindexer()
    })

    describe('when removing an existing item', () => {
      given('index', () => faker.datatype.number({ max: given.count - 1 }))
      given('link', () => getRemoveLink(given.container, '.existing', given.index))

      itBehavesLikeAReindexer()
    })

    describe('when removing a dynamic item', () => {
      beforeEach(() => given.addLink.dispatchEvent(clickEvent()))

      given('link', () => getRemoveLink(given.container, '.dynamic'))

      itBehavesLikeAReindexer()
    })

    describe('with a movable item', () => {
      given('index', () => faker.datatype.number({ min: 1, max: given.count - 2 }))
      given('item', () => given.items.item(given.index))

      describe('when moving it up', () => {
        given('link', () => getMoveUpLink(given.item))

        itBehavesLikeAReindexer()
      })

      describe('when moving it down', () => {
        given('link', () => getMoveDownLink(given.item))

        itBehavesLikeAReindexer()
      })
    })
  })
})
