/* global given */

const Cocooned = require('../../../../app/assets/javascripts/cocooned')
const faker = require('../../../../../support/faker')
const { asAttribute, asInt, clickEvent } = require('../../../support/helpers')

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
  given('insertionTemplate', () => `
    <div class="cocooned-item">
      <input type="hidden" name="list[items_attributes][new_items][_destroy]" />
      <a class="cocooned-remove dynamic" href="#">Remove</a>
      <a class="cocooned-move-up" href="#">Up</a>
      <a class="cocooned-move-down" href="#">Down</a>
      
      <input type="hidden" name="list[items_attributes][new_items][position]" value="0" />
    </div>
  `)
  given('count', () => faker.datatype.number({ min: 2, max: 5 }))
  given('existing', () => Array.from(Array(given.count), (_, i) => `
    <div class="cocooned-item">
      <input type="hidden" name="list[items_attributes][${i}][_destroy]" />
      <a class="cocooned-remove existing" href="#">Remove</a>
      <a class="cocooned-move-up" href="#">Up</a>
      <a class="cocooned-move-down" href="#">Down</a>
      
      <input type="hidden" name="list[items_attributes][${i}][position]" value="${i+1}" />
    </div>
  `).join(''))
  given('container', () => document.querySelector('section'))
  given('cocooned', () => new Cocooned(given.container, { reorderable: true }))
  given('addLink', () => given.container.querySelector('.cocooned-add'))
  given('items', () => given.container.querySelectorAll('.cocooned-item'))
  given('visibleItems', () => Array.from(given.items).filter(item => {
    return item.style.display !== 'none'
  }))
  given('positions', () => Array.from(given.visibleItems).map(item => {
    return asInt(item.querySelector('input[name$="[position]"]').getAttribute('value'))
  }))

  beforeEach(() => {
    document.body.innerHTML = given.template
    given.cocooned
  })

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
      given('removeLink', () => {
        return given.container.querySelectorAll('.cocooned-remove.existing').item(given.index)
      })

      it('reorders remaining items', () => {
        expect(given.positions).toEqual(Array.from(Array(given.count - 1), (_, i) => i + 1))
      })
    })

    describe('when removing a dynamic item', () => {
      beforeEach(() => {
        given.addLink.dispatchEvent(clickEvent())
        given.removeLink.dispatchEvent(clickEvent())
      })

      given('index', () => faker.datatype.number({ max: given.count - 1 }))
      given('removeLink', () => {
        return given.container.querySelectorAll('.cocooned-remove.dynamic').item(0)
      })

      it('reorders remaining items', () => {
        expect(given.positions).toEqual(Array.from(Array(given.count), (_, i) => i + 1))
      })
    })

    describe('when moving top the top item', () => {
      given('topItem', () => given.container.querySelectorAll('.cocooned-item').item(0))
      given('moveUpLink', () => given.topItem.querySelector('.cocooned-move-up'))

      it('does not change its position', () => {
        const positionBefore = given.topItem.querySelector('input[name*=position]').getAttribute('value')
        given.moveUpLink.dispatchEvent(clickEvent())
        const positionAfter = given.topItem.querySelector('input[name*=position]').getAttribute('value')

        expect(positionAfter).toEqual(positionBefore)
      })
    })

    describe('when moving down the bottom item', () => {
      given('bottomItem', () => given.container.querySelectorAll('.cocooned-item').item(given.count - 1))
      given('moveDownLink', () => given.bottomItem.querySelector('.cocooned-move-down'))

      it('does not change its position', () => {
        const positionBefore = asInt(given.bottomItem.querySelector('input[name*=position]').getAttribute('value'))
        given.moveDownLink.dispatchEvent(clickEvent())
        const positionAfter = asInt(given.bottomItem.querySelector('input[name*=position]').getAttribute('value'))

        expect(positionAfter).toEqual(positionBefore)
      })
    })

    describe('when moving up another item', () => {
      given('index', () => faker.datatype.number({ min: 1, max: given.count }))
      given('item', () => given.items.item(given.index))
      given('moveUpLink', () => given.item.querySelector('.cocooned-move-down'))

      it('increases its position by 1', () => {
        const positionBefore = asInt(given.item.querySelector('input[name*=position]').getAttribute('value'))
        given.moveUpLink.dispatchEvent(clickEvent())
        const positionAfter = asInt(given.item.querySelector('input[name*=position]').getAttribute('value'))

        expect(positionAfter).toEqual(positionBefore + 1)
      })
    })

    describe('when moving down another item', () => {
      given('index', () => faker.datatype.number({ max: given.count - 1 }))
      given('item', () => given.items.item(given.index))
      given('moveDownLink', () => given.item.querySelector('.cocooned-move-up'))

      it('decreases its position by 1', () => {
        const positionField = given.item.querySelector('input[name*=position]')
        const positionBefore = asInt(positionField.getAttribute('value'))
        given.moveDownLink.dispatchEvent(clickEvent())
        const positionAfter = asInt(positionField.getAttribute('value'))

        expect(positionAfter).toEqual(positionBefore - 1)
      })
    })
  })
})
