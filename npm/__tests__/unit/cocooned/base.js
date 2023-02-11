/* global given */

import { Base } from '@notus.sh/cocooned/src/cocooned/base'
import { faker } from '@cocooned/tests/support/faker'
import { getItem } from '@cocooned/tests/support/helpers'

describe('Base', () => {
  describe('defaultOptions', () => {
    it('detects animation support', () => {
      expect(Base.defaultOptions).toEqual(expect.objectContaining({ animate: false }))
    })
  })

  beforeEach(() => {
    document.body.innerHTML = given.html
    given.instance.start()
  })

  given('instance', () => new Base(given.container))
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
      expect(getItem(document).style?.display).toEqual('none')
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
        <div data-cocooned-item style="display: none"></div>
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

  const itBehavesLikeAVisibilityMethod = ({ toggle, display }) => {
    given('item', () => getItem(given.container))

    it(`sets element display`, () => {
      toggle(given.item)
      expect(given.item.style?.display).toEqual(display)
    })

    describe.skip('when animated', () => { // Element.animate is not available in JSDOM :/
      it(`returns a Promise`, () => {
        expect(toggle(given.item, { animate: true })).toBeInstanceOf(Promise)
      })

      it(`returns a Promise with the toggled item as param`, () => {
        return new Promise(resolve => {
          toggle(given.item, { animate: true }).then(value => {
            expect(value).toEqual(given.item)
            resolve()
          })
        })
      })
    })

    describe('when not animated', () => {
      it(`returns a Promise`, () => {
        expect(toggle(given.item, { animate: false })).toBeInstanceOf(Promise)
      })

      it(`returns a Promise with the toggled item as param`, () => {
        return new Promise(resolve => {
          toggle(given.item, { animate: false }).then(value => {
            expect(value).toEqual(given.item)
            resolve()
          })
        })
      })
    })
  }

  describe('hide', () => {
    itBehavesLikeAVisibilityMethod({
      toggle: (...args) => given.instance.hide(...args),
      display: 'none'
    })
  })

  describe('show', () => {
    itBehavesLikeAVisibilityMethod({
      toggle: (...args) => given.instance.show(...args),
      display: '' // Even if we set it to null
    })
  })
})
