/* global given, delegate, abnegate */

const Cocooned = require('@cocooned/src/javascripts/cocooned')
const faker = require('@cocooned/tests/support/faker')
const { asAttribute, clickEvent } = require('@cocooned/tests/support/helpers')

const itBehavesLikeAnEventListener = require('@cocooned/tests/unit/shared/events/listener')
const itBehavesLikeACancellableEvent = require('@cocooned/tests/unit/shared/events/cancelable')

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
  given('addLink', () => given.container.querySelector('.cocooned-add'))
  given('items', () => given.container.querySelectorAll('.cocooned-item'))
  given('visibleItems', () => Array.from(given.items).filter(item => {
    return item.style.display !== 'none'
  }))

  beforeEach(() => {
    document.body.innerHTML = given.template
    given.cocooned
  })

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
      given('link', () => given.container.querySelectorAll('.cocooned-remove.existing').item(given.index))

      itBehavesLikeAReindexer()
    })

    describe('when removing a dynamic item', () => {
      beforeEach(() => given.addLink.dispatchEvent(clickEvent()))

      given('link', () => given.container.querySelectorAll('.cocooned-remove.dynamic').item(0))

      itBehavesLikeAReindexer()
    })

    describe('with a movable item', () => {
      given('index', () => faker.datatype.number({ min: 1, max: given.count - 2 }))
      given('item', () => given.items.item(given.index))

      describe('when moving it up', () => {
        given('link', () => given.item.querySelector('.cocooned-move-up'))

        itBehavesLikeAReindexer()
      })

      describe('when moving it down', () => {
        given('link', () => given.item.querySelector('.cocooned-move-down'))

        itBehavesLikeAReindexer()
      })
    })
  })
})
