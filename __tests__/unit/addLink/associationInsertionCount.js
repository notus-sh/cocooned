/* global given */

const Cocooned = require('@cocooned/src/javascripts/cocooned')
const faker = require('@cocooned/tests/support/faker')
const { asAttribute, clickEvent } = require('@cocooned/tests/support/helpers')

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
  given('items', () => given.container.querySelectorAll('.cocooned-item'))

  beforeEach(() => {
    document.body.innerHTML = given.template
    new Cocooned(given.container)

    given.addLink.dispatchEvent(clickEvent())
  })

  describe('without association-insertion-count', () => {
    it('insert a single item', () => {
      expect(given.items.length).toEqual(1)
    })
  })

  describe('with association-insertion-count', () => {
    given('template', () => `
      <section>
        <div>
          <a class="cocooned-add" href="#"
             data-associations="items"
             data-association-insertion-count="${given.insertionCount}"
             data-association-insertion-template="${asAttribute(given.insertionTemplate)}">Add</a>
        </div>
      </section>
    `)
    given('insertionCount', () => faker.datatype.number({ min: 2, max: 5 }))

    it('insert the correct count of items', () => {
      expect(given.items.length).toEqual(given.insertionCount)
    })
  })
})
