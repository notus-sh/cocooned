/* global given */

import Cocooned from '@notus.sh/cocooned'
import { jest } from '@jest/globals'
import { faker } from '@cocooned/tests/support/faker'
import { clickEvent, getMoveUpLink, getMoveDownLink } from '@cocooned/tests/support/helpers'

describe('A Cocooned setup with options for the reorderable plugin', () => {
  beforeEach(() => {
    document.body.innerHTML = given.html

    const cocooned = new Cocooned(given.container, { reorderable: true })
    cocooned.start()
  })

  given('container', () => document.querySelector('section'))
  given('count', () => faker.number.int({ min: 3, max: 8 }))
  given('index', () => faker.number.int({ min: 1, max: given.count - 2 }))
  given('template', () => `
    <div data-cocooned-item>
      <a data-cocooned-trigger="up" href="#">Up</a>
      <a data-cocooned-trigger="down" href="#">Down</a>
      <input type="hidden" name="list[items_attributes][new_items][position]" value="0" />
    </div>
  `)
  given('html', () => `
    <section data-cocooned-container>
      ${Array.from(Array(given.count), () => given.template).join('\n')}
      <div>
        <a data-cocooned-trigger="add" href="#"
           data-association="items"
           data-template="template">Add</a>
        <template data-name="template">${given.template}</template>
      </div>
    </section>
  `)

  it('triggers a before-move event when moving an item up', () => {
    const listener = jest.fn()
    given.container.addEventListener('cocooned:before-move', listener)
    getMoveUpLink(given.container, given.index).dispatchEvent(clickEvent())

    expect(listener).toHaveBeenCalled()
  })

  it('triggers a before-move event when moving an item down', () => {
    const listener = jest.fn()
    given.container.addEventListener('cocooned:before-move', listener)
    getMoveDownLink(given.container, given.index).dispatchEvent(clickEvent())

    expect(listener).toHaveBeenCalled()
  })
})
