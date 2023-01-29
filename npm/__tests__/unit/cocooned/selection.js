/* global given */

import { Selection } from '@notus.sh/cocooned/src/cocooned/selection'
import { jest } from '@jest/globals'
import { faker } from '@cocooned/tests/support/faker'

describe('Selection', () => {
  beforeEach(() => document.body.innerHTML = given.html)

  given('selection', () => new Selection(given.container, { transitions: true }))
  given('container', () => document.querySelector('.cocooned-container'))
  given('count', () => faker.datatype.number({ min: 1, max: 5 }))
  given('items', () => Array.from(Array(given.count), (_, i) => `
    <div class="cocooned-item"></div>
  `))
  given('html', () => `
    <div class="cocooned-container">
      ${given.items.join('')}
    </div>
  `)

  describe('when created', () => {
    beforeEach(() => new Selection(given.container))

    given('styles', () => given.container.firstElementChild)

    it('inject styles to container', () => {
      expect(given.styles.tagName).toEqual('STYLE')
    })

    it('inject scoped styles to container', () => {
      expect(given.styles.getAttribute('scoped')).toBeTruthy()
    })
  })

  describe('items', () => {
    it('returns an array', () => {
      expect(given.selection.items).toBeInstanceOf(Array)
    })

    it('returns an array of DOM Node', () => {
      const constructors = given.selection.items.map(item => item.constructor.name)
      expect([...new Set(constructors)]).toEqual([HTMLDivElement.name])
    })

    it('returns correct number of items', () => {
      expect(given.selection.items.length).toEqual(given.count)
    })

    describe('with nested containers', () => {
      given('nested', () => Array.from(Array(given.count), (_, i) => `
        <div class="cocooned-item nested"></div>
      `))
      given('html', () => `
        <div class="cocooned-container">
          ${given.items.join('')}
          <div class="cocooned-container">
            ${given.nested.join('')}
          </div>
        </div>
      `)

      it('returns correct number of items', () => {
        expect(given.selection.items.length).toEqual(given.count)
      })

      it("returns only container's items", () => {
        const nested = given.selection.items.map(item => item.matches('.nested'))
        expect([...new Set(nested)]).toEqual([false])
      })
    })
  })

  describe('contains', () => {
    describe('when given node is one of the container items', () => {
      given('item', () => document.querySelector('.cocooned-item'))

      it('returns true', () => {
        expect(given.selection.contains(given.item)).toBeTruthy()
      })
    })

    describe('when given node is not one of container items', () => {
      it('returns true', () => {
        expect(given.selection.contains(given.container)).toBeFalsy()
      })
    })
  })

  describe('matches', () => {
    it.skip('should be tested', () => {})
  })

  const itBehavesLikeAVisibilityMethod = ({ expected, other, toggle }) => {
    given('item', () => document.querySelector('.cocooned-item'))

    it(`adds a ${expected} class to item`, () => {
      toggle(given.item)
      expect(given.item.classList).toContain(expected)
    })

    it(`removes ${other} class if present`, () => {
      given.item.classList.add(other)
      toggle(given.item)

      expect(given.item.classList).not.toContain(other)
    })

    describe('with transitions', () => {
      it(`supports callback`, () => {
        const listener = jest.fn()
        toggle(given.item, listener)
        given.item.dispatchEvent(new Event('transitionend'))

        expect(listener).toHaveBeenCalled()
      })

      it(`supports single use callback`, () => {
        const listener = jest.fn()
        toggle(given.item, listener)
        given.item.dispatchEvent(new Event('transitionend'))
        given.item.dispatchEvent(new Event('transitionend'))

        expect(listener).toHaveBeenCalledTimes(1)
      })
    })

    describe('without transitions', () => {
      given('selection', () => new Selection(given.container, { transitions: false }))

      it(`triggers callback automatically`, () => {
        const listener = jest.fn()
        toggle(given.item, listener)

        expect(listener).toHaveBeenCalled()
      })
    })
  }

  describe('hide', () => {
    itBehavesLikeAVisibilityMethod({
      expected: 'cocooned-item--hidden',
      other: 'cocooned-item--visible',
      toggle: (...args) => given.selection.hide(...args)
    })
  })

  describe('show', () => {
    itBehavesLikeAVisibilityMethod({
      expected: 'cocooned-item--visible',
      other: 'cocooned-item--hidden',
      toggle: (...args) => given.selection.show(...args)
    })
  })
})
