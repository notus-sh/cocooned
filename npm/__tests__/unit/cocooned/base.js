/* global given */

import { Base } from '@notus.sh/cocooned/src/cocooned/base'
import { jest } from '@jest/globals'
import { faker } from '@cocooned/tests/support/faker'
import { getItem } from '@cocooned/tests/support/helpers'

describe('Base', () => {
  beforeEach(() => {
    document.body.innerHTML = given.html
    given.instance.start()
  })

  given('instance', () => new Base(given.container, { transitions: true }))
  given('container', () => document.querySelector('[data-cocooned-container]'))
  given('count', () => faker.datatype.number({ min: 1, max: 5 }))
  given('items', () => Array.from(Array(given.count), () => '<div data-cocooned-item></div>'))
  given('html', () => `
    <div data-cocooned-container>
      ${given.items.join('')}
    </div>
  `)

  it('associates itself with the container', () => {
    expect(given.container.dataset).toEqual(expect.objectContaining({ cocoonedUuid: expect.any(String) }))
  })

  describe('getInstance', () => {
    it('finds an instance by its UUID', () => {
      expect(Base.getInstance(given.container.dataset.cocoonedUuid)).toEqual(given.instance)
    })
  })

  describe('when created', () => {
    given('styles', () => given.container.firstElementChild)

    it('inject styles to container', () => {
      expect(given.styles.tagName).toEqual('STYLE')
    })

    it('inject scoped styles to container', () => {
      expect(given.styles.getAttribute('scoped')).toBeTruthy()
    })
  })

  describe('with items marked for destruction', () => {
    given('html', () => `
      <div data-cocooned-container>
        <div data-cocooned-item>
          <a data-cocooned-trigger="remove" data-cocooned-persisted="true" href="#">Remove</a>
          <input type="hidden" name="items[0][_destroy]" value="true" />
        </div>
      </div>
    `)

    it('hides them', () => {
      expect(getItem(document).classList).toContain('cocooned-item--hidden')
    })
  })

  describe('items', () => {
    it('returns an array', () => {
      expect(given.instance.items).toBeInstanceOf(Array)
    })

    it('returns an array of DOM Node', () => {
      const constructors = given.instance.items.map(item => item.constructor.name)
      expect([...new Set(constructors)]).toEqual([HTMLDivElement.name])
    })

    it('returns correct number of items', () => {
      expect(given.instance.items.length).toEqual(given.count)
    })

    describe('with nested containers', () => {
      given('nested', () => Array.from(Array(given.count), () => '<div data-cocooned-item class="nested"></div>'))
      given('html', () => `
        <div data-cocooned-container>
          ${given.items.join('')}
          <div data-cocooned-container>
            ${given.nested.join('')}
          </div>
        </div>
      `)

      it('returns correct number of items', () => {
        expect(given.instance.items.length).toEqual(given.count)
      })

      it("returns only container's items", () => {
        const nested = given.instance.items.map(item => item.matches('.nested'))
        expect([...new Set(nested)]).toEqual([false])
      })
    })

    describe('with hidden items', () => {
      given('items', () => Array.from(Array(given.count), () => `
        <div data-cocooned-item class="cocooned-item--hidden"></div>
      `))

      it('ignores them', () => {
        expect(given.instance.items.length).toEqual(0)
      })
    })
  })

  describe('toContainer', () => {
    given('origin', () => document.querySelector('.origin'))
    given('items', () => [`
      <div data-cocooned-item>
        <div class="origin"></div>
      </div>
    `])

    it('returns the closest container', () => {
      expect(given.instance.toContainer(given.origin)).toEqual(given.container)
    })
  })

  describe('toItem', () => {
    given('origin', () => document.querySelector('.origin'))
    given('items', () => [`
      <div data-cocooned-item>
        <div class="origin"></div>
      </div>
    `])

    it('returns the closest item', () => {
      expect(given.instance.toItem(given.origin)).toEqual(getItem(given.container))
    })
  })

  describe('contains', () => {
    describe('when given node is one of the container items', () => {
      it('returns true', () => {
        expect(given.instance.contains(getItem(given.container))).toBeTruthy()
      })
    })

    describe('when given node is not one of container items', () => {
      it('returns false', () => {
        expect(given.instance.contains(given.container)).toBeFalsy()
      })
    })
  })

  const itBehavesLikeAVisibilityMethod = ({ expected, other, toggle }) => {
    given('item', () => getItem(given.container))

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
      it('supports callback', () => {
        const listener = jest.fn()
        toggle(given.item, listener)
        given.item.dispatchEvent(new Event('transitionend'))

        expect(listener).toHaveBeenCalled()
      })

      it('supports single use callback', () => {
        const listener = jest.fn()
        toggle(given.item, listener)
        given.item.dispatchEvent(new Event('transitionend'))
        given.item.dispatchEvent(new Event('transitionend'))

        expect(listener).toHaveBeenCalledTimes(1)
      })
    })

    describe('without transitions', () => {
      given('instance', () => new Base(given.container, { transitions: false }))

      it('triggers callback automatically', () => {
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
      toggle: (...args) => given.instance.hide(...args)
    })
  })

  describe('show', () => {
    itBehavesLikeAVisibilityMethod({
      expected: 'cocooned-item--visible',
      other: 'cocooned-item--hidden',
      toggle: (...args) => given.instance.show(...args)
    })
  })
})
