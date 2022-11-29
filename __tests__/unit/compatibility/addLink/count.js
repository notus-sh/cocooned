/* global given */

const Cocooned = require('../../../../app/assets/javascripts/cocooned')
const faker = require('../../../support/faker')
const { asAttribute, clickEvent } = require('../../../support/helpers')

describe('A Cocooned setup', () => {
  given('template', () => `
    <section>
      <div>
        <a class="cocooned-add" href="#"
           data-associations="items"
           data-count="${given.count}"
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

  describe('with count', () => {
    given('count', () => faker.datatype.number({ min: 2, max: 5 }))

    it('insert the correct count of items', () => {
      expect(given.items.length).toEqual(given.count)
    })
  })
})
