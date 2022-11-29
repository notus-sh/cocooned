/* global given, delegate, abnegate */

const Cocooned = require('@cocooned/src/javascripts/cocooned')
const { asAttribute, clickEvent } = require('@cocooned/tests/support/helpers')

const itBehavesLikeAnEventListener = require('@cocooned/tests/unit/shared/events/listener')
const itBehavesLikeACancellableEvent = require("@cocooned/tests/unit/shared/events/cancelable");

describe('A Cocooned setup', () => {
  given('template', () => `
    <section>
      ${given.insertionTemplate}
      
      <div>
        <a class="cocooned-add" href="#"
           data-associations="items"
           data-association-insertion-template="${asAttribute(given.insertionTemplate)}">Add</a>
      </div>
    </section>
  `)
  given('insertionTemplate', () => `
    <div class="cocooned-item">
      <a class="cocooned-remove dynamic" href="#">Remove</a>
    </div>
  `)
  given('container', () => document.querySelector('section'))
  given('removeLink', () => document.querySelector('.cocooned-remove'))
  given('item', () => given.container.querySelector('.cocooned-item'))
  given('cocooned', () => new Cocooned(given.container))

  beforeEach(() => {
    document.body.innerHTML = given.template
    given.cocooned
  })

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
      trigger: () => { $(given.removeLink).trigger('click') },
    })
  })
})
