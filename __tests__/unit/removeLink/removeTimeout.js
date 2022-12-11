/* global given */

const Cocooned = require('@cocooned/src/javascripts/cocooned')
const faker = require('@cocooned/tests/support/faker')
const { asAttribute, clickEvent } = require('@cocooned/tests/support/helpers')

describe('A Cocooned setup with remove-timeout', () => {
  given('template', () => `
    <section data-remove-timeout="${given.timeout}">
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
      <a class="cocooned-remove dynamic" href="#">Remove</a>
    </div>
  `)
  given('timeout', () => faker.datatype.number({ min: 10, max: 50 }))
  given('container', () => document.querySelector('section'))
  given('item', () => given.container.querySelector('.cocooned-item'))
  given('cocooned', () => new Cocooned(given.container))

  beforeEach(() => {
    document.body.innerHTML = given.template
    given.cocooned
  })

  describe('with existing item', () => {
    given('existing', () => `
      <div class="cocooned-item">
        <a class="cocooned-remove existing" href="#">Remove</a>
      </div>
    `)
    given('removeLink', () => document.querySelector('.cocooned-remove'))

    it('waits before hiding the item', () => {
      given.removeLink.dispatchEvent(clickEvent())
      expect(given.item).toBeVisible()
    })

    it('waits the specified time before hiding the item', done => {
      given.removeLink.dispatchEvent(clickEvent())

      setTimeout(() => {
        expect(given.item).not.toBeVisible()
        done()
      }, given.timeout)
    })
  })
})