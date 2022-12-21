/* global given */

import Cocooned from '@notus.sh/cocooned/cocooned'
import { faker } from '@cocooned/tests/support/faker'
import { setup, asAttribute, clickEvent } from '@cocooned/tests/support/helpers'
import { getItem, getRemoveLink } from '@cocooned/tests/support/selectors'

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
  given('cocooned', () => new Cocooned(given.container))
  given('item', () => getItem(given.container))

  beforeEach(() => setup(document, given))

  describe('with existing item', () => {
    given('existing', () => `
      <div class="cocooned-item">
        <a class="cocooned-remove existing" href="#">Remove</a>
      </div>
    `)
    given('removeLink', () => getRemoveLink(given.container))

    it('waits before hiding the item', () => {
      given.removeLink.dispatchEvent(clickEvent())
      expect(given.item).toBeVisible()
    })

    it('waits the specified time before hiding the item', () => {
      return new Promise(resolve => {
        given.removeLink.dispatchEvent(clickEvent())

        setTimeout(() => {
          expect(given.item).not.toBeVisible()
          resolve()
        }, given.timeout)
      })
    })
  })
})
