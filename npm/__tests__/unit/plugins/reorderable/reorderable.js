/* global given, delegate, abnegate */

import Cocooned from '@notus.sh/cocooned/cocooned'
import { jest } from '@jest/globals'
import { faker } from '@cocooned/tests/support/faker'
import { setup, asAttribute, asInt, clickEvent } from '@cocooned/tests/support/helpers'
import { getItems, getAddLink, getRemoveLink, getMoveUpLink, getMoveDownLink } from '@cocooned/tests/support/selectors'

describe('A Cocooned setup', () => {
  given('template', () => `
    <section>
      ${given.existing}
      <div>
        <a class="cocooned-add" href="#"
           data-association="items"
           data-template="template">Add</a>
        <template data-name="template">${given.insertionTemplate}</template>
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
  given('addLink', () => getAddLink(given.container))
  given('items', () => getItems(given.container))
  given('visibleItems', () => Array.from(given.items).filter(item => {
    return item.style.display !== 'none'
  }))
  given('positions', () => Array.from(given.visibleItems).map(item => {
    return asInt(item.querySelector('input[name$="[position]"]').getAttribute('value'))
  }))

  beforeEach(() => setup(document, given))

  describe('with options for the reorderable plugin', () => {
    describe('when adding an item', () => {
      beforeEach(() => given.addLink.dispatchEvent(clickEvent()))

      it('reorders items', () => {
        expect(given.positions).toEqual(Array.from(Array(given.count + 1), (_, i) => i + 1))
      })
    })

    describe('when removing an existing item', () => {
      beforeEach(() => given.removeLink.dispatchEvent(clickEvent()))

      given('index', () => faker.datatype.number({ max: given.count - 1 }))
      given('removeLink', () => getRemoveLink(given.container, '.existing', given.index))

      it('reorders remaining items', () => {
        expect(given.positions).toEqual(Array.from(Array(given.count - 1), (_, i) => i + 1))
      })
    })

    describe('when removing a dynamic item', () => {
      beforeEach(() => {
        given.addLink.dispatchEvent(clickEvent())
        given.removeLink.dispatchEvent(clickEvent())
      })

      given('removeLink', () => getRemoveLink(given.container, '.dynamic'))

      it('reorders remaining items', () => {
        expect(given.positions).toEqual(Array.from(Array(given.count), (_, i) => i + 1))
      })
    })

    describe('with a movable item', () => {
      beforeEach(() => {
        delegate('cocooned:before-move', ['event', 'node', 'cocooned'])
        delegate('cocooned:after-move', ['event', 'node', 'cocooned'])
      })
      afterEach(() => {
        abnegate('cocooned:before-move')
        abnegate('cocooned:after-move')
      })

      given('index', () => faker.datatype.number({ min: 1, max: given.count - 2 }))
      given('item', () => given.items.item(given.index))

      const position = (item) => asInt(item.querySelector('input[name*=position]').getAttribute('value'))

      describe('when moving it up', () => {
        given('moveUpLink', () => getMoveUpLink(given.item))

        it('decreases its position by 1', () => {
          return new Promise(resolve => {
            const positionBefore = position(given.item)
            const listener = jest.fn(() => {
              const positionAfter = position(given.item)
              expect(positionAfter).toEqual(positionBefore - 1)
              resolve()
            })

            given.container.addEventListener('$cocooned:after-move', listener)
            given.moveUpLink.dispatchEvent(clickEvent())
          })
        })
      })

      describe('when moving it down', () => {
        given('moveDownLink', () => getMoveDownLink(given.item))

        it('increases its position by 1', () => {
          return new Promise(resolve => {
            const positionBefore = position(given.item)
            const listener = jest.fn(() => {
              const positionAfter = position(given.item)
              expect(positionAfter).toEqual(positionBefore + 1)
              resolve()
            })

            given.container.addEventListener('$cocooned:after-move', listener)
            given.moveDownLink.dispatchEvent(clickEvent())
          })
        })
      })
    })
  })
})
