/* global given */

const Cocooned = require('@cocooned/src/javascripts/cocooned')
const faker = require('@cocooned/tests/support/faker')
const { asAttribute, asInt, clickEvent } = require('@cocooned/tests/support/helpers')

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
  given('insertionTemplate', () => `
    <div class="cocooned-item">
      <input type="hidden" name="list[items_attributes][new_items][_destroy]" />
      <a class="cocooned-remove dynamic" href="#">Remove</a>
      <a class="cocooned-move-up" href="#">Up</a>
      <a class="cocooned-move-down" href="#">Down</a>
      
      <input type="hidden" name="list[items_attributes][new_items][position]" value="0" />
    </div>
  `)
  given('container', () => document.querySelector('section'))
  given('cocooned', () => new Cocooned(given.container, given.options))
  given('addLink', () => given.container.querySelector('.cocooned-add'))
  given('items', () => given.container.querySelectorAll('.cocooned-item'))
  given('positions', () => Array.from(given.items).map(item => {
    return asInt(item.querySelector('input[name$="[position]"]').getAttribute('value'))
  }))

  beforeEach(() => {
    document.body.innerHTML = given.template
    given.cocooned
  })

  describe('with default options for the reorderable plugin', () => {
    given('options', () => { return { reorderable: true } })

    describe('when reindexing items', () => {
      it('reindex them starting at 1', () => {
        given.addLink.dispatchEvent(clickEvent())
        expect(given.positions).toEqual([1])
      })
    })
  })

  describe('with non default options for the reorderable plugin', () => {
    given('startAt', () => faker.datatype.number())
    given('options', () => { return { reorderable: { startAt: given.startAt } } })

    describe('when reindexing items', () => {
      it('reindex them starting at the expected position', () => {
        given.addLink.dispatchEvent(clickEvent())
        expect(given.positions).toEqual([given.startAt])
      })
    })
  })
})
