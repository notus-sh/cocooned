/* global given */

const Cocooned = require('../../../app/assets/javascripts/cocooned')
const { asAttribute, clickEvent } = require('../../support/helpers')

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
    given('insertionCount', () => 1 + Math.floor(Math.random() * 4))

    it('insert the correct count of items', () => {
      expect(given.items.length).toEqual(given.insertionCount)
    })
  })
})
