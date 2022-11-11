/* global given */

const Cocooned = require('../../../app/assets/javascripts/cocooned')
const { asAttribute, clickEvent } = require('../../support/helpers')

describe('A Cocooned setup', () => {
  given('template', () => `
    <section>
      ${given.existing}
      <div>
        <a class="cocooned-add" href="#"
           data-association-insertion-template="${asAttribute(given.insertionTemplate)}">Add</a>
      </div>
    </section>
  `)
  given('insertionTemplate', () => '<div class="cocooned-item"></div>')
  given('existing', () => '')
  given('container', () => document.querySelector('section'))
  given('items', () => given.container.querySelectorAll('.cocooned-item'))
  given('cocooned', () => new Cocooned(given.container, { limit: given.limit }))
  given('addLink', () => given.container.querySelector('.cocooned-add'))

  beforeEach(() => {
    document.body.innerHTML = given.template
    given.cocooned
  })

  describe('with options for the limit plugin', () => {
    given('limit', () => 1 + Math.floor(Math.random() * 4))

    it('limits how many items can be added to the container', () => {
      for (let i = 0; i <= given.limit; i++) {
        given.addLink.dispatchEvent(clickEvent())
      }

      expect(given.items.length).toEqual(given.limit)
    })

    describe('with already existing elements', () => {
      given('existing', () => `
        <div class="cocooned-item">
          <input type="hidden" name="list[items_attributes][0][_destroy]" />
          <a class="cocooned-remove existing" href="#">Remove</a>
        </div>
      `)

      it('limits total number of items the container can hold', () => {
        for (let i = 0; i <= given.limit; i++) {
          given.addLink.dispatchEvent(clickEvent())
        }

        expect(given.items.length).toEqual(given.limit)
      })

      describe('when removed', () => {
        given('removeLink', () => document.querySelector('.cocooned-remove'))

        it('limits total number of visible items in the container', () => {
          given.removeLink.dispatchEvent(clickEvent())
          for (let i = 0; i <= given.limit; i++) {
            given.addLink.dispatchEvent(clickEvent())
          }

          expect(given.items.length).toEqual(given.limit + 1)
        })
      })
    })
  })
})
