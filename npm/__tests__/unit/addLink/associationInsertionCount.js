/* global given */

import Cocooned from '@notus.sh/cocooned/cocooned'
import { faker } from '@cocooned/tests/support/faker'
import { setup, asAttribute, clickEvent } from '@cocooned/tests/support/helpers'
import { getItems, getAddLink } from '@cocooned/tests/support/selectors'

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
  given('cocooned', () => new Cocooned(given.container))
  given('addLink', () => getAddLink(given.container))
  given('items', () => getItems(given.container))

  beforeEach(() => {
    setup(document, given)

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