/* global given, delegate, abnegate */

const Cocooned = require('@cocooned/src/javascripts/cocooned')
const faker = require('@cocooned/tests/support/faker')
const { setup, asAttribute, clickEvent } = require('@cocooned/tests/support/helpers')
const { getAddLink, getMoveDownLinks, getMoveUpLinks } = require('@cocooned/tests/support/selectors')

const itBehavesLikeAnEventListener = require('@cocooned/tests/unit/shared/events/listener')
const itBehavesLikeACancellableEvent = require('@cocooned/tests/unit/shared/events/cancelable')

describe('A Cocooned reorderable setup', () => {
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
  given('moveUpLinks', () => getMoveUpLinks(given.container))
  given('moveDownLinks', () => getMoveDownLinks(given.container))

  beforeEach(() => setup(document, given))

  describe('events on move', () => {
    beforeEach(() => {
      delegate('cocooned:before-move', ['event', 'node', 'cocooned'])
      delegate('cocooned:after-move', ['event', 'node', 'cocooned'])
    })
    afterEach(() => {
      abnegate('cocooned:before-move')
      abnegate('cocooned:after-move')
    })

    /* eslint-disable jest/no-identical-title */
    const itBehavesLikeASingleMoveLink = () => {
      beforeEach(() => jest.useFakeTimers())

      describe('a before-move event', () => {
        it('is not triggered', () => {
          const listener = jest.fn()
          given.container.addEventListener('$cocooned:before-move', listener)
          given.link.dispatchEvent(clickEvent())
          jest.runAllTimers()

          expect(listener).not.toHaveBeenCalled()
          given.container.removeEventListener('$cocooned:before-move', listener)
        })
      })

      describe('an after-move event', () => {
        it('is not triggered', () => {
          const listener = jest.fn()
          given.container.addEventListener('$cocooned:after-move', listener)
          given.link.dispatchEvent(clickEvent())
          jest.runAllTimers()

          expect(listener).not.toHaveBeenCalled()
          given.container.removeEventListener('$cocooned:after-move', listener)
        })
      })
    }

    const itBehavesLikeAMoveLink = () => {
      beforeEach(() => jest.useFakeTimers())

      describe('a before-move event', () => {
        it('is triggered', () => {
          const listener = jest.fn()
          given.container.addEventListener('$cocooned:before-move', listener)
          given.link.dispatchEvent(clickEvent())
          jest.runAllTimers()

          expect(listener).toHaveBeenCalled()
          given.container.removeEventListener('$cocooned:before-move', listener)
        })

        itBehavesLikeAnEventListener({
          listen: (listener) => given.container.addEventListener('$cocooned:before-move', listener),
          dispatch: () => {
            given.link.dispatchEvent(clickEvent())
            jest.runAllTimers()
          }
        })
      })

      describe('an after-move event', () => {
        it('is triggered', () => {
          const listener = jest.fn()
          given.container.addEventListener('$cocooned:after-move', listener)
          given.link.dispatchEvent(clickEvent())
          jest.runAllTimers()

          expect(listener).toHaveBeenCalled()
          given.container.removeEventListener('$cocooned:before-move', listener)
        })

        itBehavesLikeAnEventListener({
          listen: (listener) => given.container.addEventListener('$cocooned:after-move', listener),
          dispatch: () => {
            given.link.dispatchEvent(clickEvent())
            jest.runAllTimers()
          }
        })
      })

      itBehavesLikeACancellableEvent({
        event: 'move',
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
    /* eslint-enable jest/no-identical-title */

    describe('with a single item', () => {
      given('count', () => 1)

      describe('a move up link', () => {
        given('link', () => Array.from(given.moveUpLinks).shift())

        itBehavesLikeASingleMoveLink()
      })

      describe('a move down link', () => {
        given('link', () => Array.from(given.moveDownLinks).pop())

        itBehavesLikeASingleMoveLink()
      })
    })

    describe('with other items', () => {
      given('count', () => faker.datatype.number({ min: 3, max: 8 }))

      describe('the move up link of the top item', () => {
        given('link', () => Array.from(given.moveUpLinks).shift())

        itBehavesLikeASingleMoveLink()
      })

      describe('the move down link of the bottom item', () => {
        given('link', () => Array.from(given.moveDownLinks).pop())

        itBehavesLikeASingleMoveLink()
      })

      describe('another move up link', () => {
        given('index', () => faker.datatype.number({ min: 1, max: given.count - 1 }))
        given('link', () => given.moveUpLinks.item(given.index))

        itBehavesLikeAMoveLink()
      })

      describe('another move down link', () => {
        given('index', () => faker.datatype.number({ min: 0, max: given.count - 2 }))
        given('link', () => given.moveDownLinks.item(given.index))

        itBehavesLikeAMoveLink()
      })
    })
  })
})
