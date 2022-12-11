/* global given, delegate, abnegate */

const Cocooned = require('@cocooned/src/javascripts/cocooned')
const faker = require('@cocooned/tests/support/faker')
const { clickEvent } = require('@cocooned/tests/support/helpers')

const fixtures = require('@cocooned/tests/fixtures/list.json')

describe('A Rails generated Cocooned setup', () => {
  given('template', () => fixtures.template)
  given('container', () => document.querySelector('*[data-cocooned-options]'))
  given('addLink', () => document.querySelector('.cocooned-add'))
  given('cocooned', () => new Cocooned(given.container))

  beforeEach(() => {
    document.body.innerHTML = given.template
    given.cocooned
  })

  describe('when add link is clicked', () => {
    beforeEach(() => delegate('cocooned:before-insert'))
    afterEach(() => abnegate('cocooned:before-insert'))

    it('fires a before-insert event', () => {
      const listener = jest.fn()
      given.container.addEventListener('$cocooned:before-insert', listener)
      given.addLink.dispatchEvent(clickEvent())

      expect(listener).toHaveBeenCalled()
    })
  })

  describe('with an item', () => {
    beforeEach(() => given.addLink.dispatchEvent(clickEvent()))

    describe('when remove link is clicked', () => {
      beforeEach(() => delegate('cocooned:before-remove'))
      afterEach(() => abnegate('cocooned:before-remove'))

      given('removeLink', () => document.querySelector('.cocooned-remove'))

      it('fires a before-remove event', () => {
        const listener = jest.fn()
        given.container.addEventListener('$cocooned:before-remove', listener)
        given.removeLink.dispatchEvent(clickEvent())

        expect(listener).toHaveBeenCalled()
      })
    })
  })

  describe('with more than one item', () => {
    beforeEach(() => {
      for (let i = 0; i < given.count; i++) {
        given.addLink.dispatchEvent(clickEvent())
      }
    })

    given('count', () => faker.datatype.number({ min: 3, max: 5 }))
    given('index', () => faker.datatype.number({ min: 1, max: given.count - 2 }))

    describe('when move up link is clicked', () => {
      beforeEach(() => delegate('cocooned:before-move'))
      afterEach(() => abnegate('cocooned:before-move'))

      given('moveLink', () => document.querySelectorAll('.cocooned-move-up').item(given.index))

      it('fires a before-move event', () => {
        const listener = jest.fn()
        given.container.addEventListener('$cocooned:before-move', listener)
        given.moveLink.dispatchEvent(clickEvent())

        expect(listener).toHaveBeenCalled()
      })
    })

    describe('when move down link is clicked', () => {
      beforeEach(() => delegate('cocooned:before-move'))
      afterEach(() => abnegate('cocooned:before-move'))

      given('moveLink', () => document.querySelectorAll('.cocooned-move-down').item(given.index))

      it('fires a before-move event', () => {
        const listener = jest.fn()
        given.container.addEventListener('$cocooned:before-move', listener)
        given.moveLink.dispatchEvent(clickEvent())

        expect(listener).toHaveBeenCalled()
      })
    })
  })
})
