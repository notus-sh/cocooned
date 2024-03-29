/* global given */

import Cocooned from '@notus.sh/cocooned'
import { jest } from '@jest/globals'
import { faker } from '@cocooned/tests/support/faker'
import { clickEvent, getItems, getAddLink } from '@cocooned/tests/support/helpers'

describe('A Cocooned setup with options for the limit plugin', () => {
  beforeEach(() => {
    document.body.innerHTML = given.html

    const cocooned = new Cocooned(given.container, { limit: given.limit })
    cocooned.start()
  })

  given('html', () => `
    <section data-cocooned-container>
      <div>
        <a data-cocooned-trigger="add" href="#"
           data-association="items"
           data-template="template">Add</a>
        <template data-name="template">${given.template}</template>
      </div>
    </section>
  `)
  given('template', () => '<div data-cocooned-item></div>')
  given('container', () => document.querySelector('section'))
  given('limit', () => faker.number.int({ min: 2, max: 5 }))
  given('addLink', () => getAddLink(given.container))

  it('limits how many items can be added to the container', () => {
    for (let i = 0; i <= given.limit; i++) {
      given.addLink.dispatchEvent(clickEvent())
    }

    expect(getItems(given.container).length).toEqual(given.limit)
  })

  it('triggers an event when limit is reached', () => {
    const listener = jest.fn()
    given.container.addEventListener('cocooned:limit-reached', listener)

    for (let i = 0; i <= given.limit; i++) {
      given.addLink.dispatchEvent(clickEvent())
    }

    expect(listener).toHaveBeenCalled()
  })
})
