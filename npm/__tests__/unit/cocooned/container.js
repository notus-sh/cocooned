/* global given */

import Container from '@notus.sh/cocooned/src/cocooned/container'
import { jest } from '@jest/globals'
import { faker } from '@cocooned/tests/support/faker'

describe('Container', () => {
  beforeEach(() => document.body.innerHTML = given.html)

  given('container', () => new Container(given.wrapper))
  given('wrapper', () => document.querySelector('.cocooned-container'))
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
    beforeEach(() => new Container(given.wrapper))

    given('styles', () => given.wrapper.firstElementChild)

    it('inject styles to container', () => {
      expect(given.styles.tagName).toEqual('STYLE')
    })

    it('inject scoped styles to container', () => {
      expect(given.styles.getAttribute('scoped')).toBeTruthy()
    })
  })

  describe('items', () => {
    it('returns an array', () => {
      expect(given.container.items).toBeInstanceOf(Array)
    })

    it('returns an array of DOM Node', () => {
      const constructors = given.container.items.map(item => item.constructor.name)
      expect([...new Set(constructors)]).toEqual([HTMLDivElement.name])
    })

    it('returns correct number of items', () => {
      expect(given.container.items.length).toEqual(given.count)
    })

    describe('with nested wrappers', () => {
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
        expect(given.container.items.length).toEqual(given.count)
      })

      it("returns only container's items", () => {
        const nested = given.container.items.map(item => item.matches('.nested'))
        expect([...new Set(nested)]).toEqual([false])
      })
    })
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
  }

  describe('hide', () => {
    itBehavesLikeAVisibilityMethod({
      expected: 'cocooned-item--hidden',
      other: 'cocooned-item--visible',
      toggle: (...args) => given.container.hide(...args)
    })
  })

  describe('show', () => {
    itBehavesLikeAVisibilityMethod({
      expected: 'cocooned-item--visible',
      other: 'cocooned-item--hidden',
      toggle: (...args) => given.container.show(...args)
    })
  })
})
