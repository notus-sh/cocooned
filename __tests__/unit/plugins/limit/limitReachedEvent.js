/* global given, delegate, abnegate */

const Cocooned = require('@cocooned/src/javascripts/cocooned')
const { asAttribute, clickEvent } = require('@cocooned/tests/support/helpers')
const { getItems, getAddLink } = require('@cocooned/tests/support/selectors')

const itBehavesLikeAnEventListener = require('@cocooned/tests/unit/shared/events/listener')

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
  given('insertionTemplate', () => '<div class="cocooned-item"></div>')
  given('existing', () => given.insertionTemplate)
  given('container', () => document.querySelector('section'))
  given('items', () => getItems(given.container))
  given('cocooned', () => new Cocooned(given.container, { limit: 1 }))
  given('addLink', () => getAddLink(given.container))

  beforeEach(() => {
    document.body.innerHTML = given.template
    given.cocooned
  })

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
