/* global given, delegate, abnegate */

const Cocooned = require('../../../app/assets/javascripts/cocooned')
const { asAttribute, clickEvent } = require('../../support/helpers')

const itBehavesLikeAnEventListener = require('../shared/events/listener')
const itBehavesLikeACancellableEvent = require("../shared/events/cancelable")

describe('A Cocooned setup', () => {
  given('template', () => `
    <section>
      <div>
        <a class="cocooned-add" href="#"
           data-associations="items"
           data-association-insertion-template="${asAttribute(given.insertionTemplate)}">Add</a>
      </div>
    </section>
  `)
  given('insertionTemplate', () => '<div class="cocooned-item"></div>')
  given('container', () => document.querySelector('section'))
  given('addLink', () => document.querySelector('.cocooned-add'))
  given('item', () => given.container.querySelector('.cocooned-item'))
  given('cocooned', () => new Cocooned(given.container))

  beforeEach(() => {
    document.body.innerHTML = given.template
    given.cocooned
  })

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
        listen: (listener) => { given.container.addEventListener('$cocooned:before-insert', listener) },
        dispatch: () => { given.addLink.dispatchEvent(clickEvent()) }
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
        listen: (listener) => { given.container.addEventListener('$cocooned:after-insert', listener) },
        dispatch: () => { given.addLink.dispatchEvent(clickEvent()) }
      })
    })

    itBehavesLikeACancellableEvent({
      event: 'insert',
      dispatch: () => { given.link.dispatchEvent(clickEvent()) },
      trigger: () => { $(given.link).trigger('click') },
    })
  })
})
