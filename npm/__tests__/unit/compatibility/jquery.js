/* global given */

import '@notus.sh/cocooned/cocooned'
import { asAttribute } from '@cocooned/tests/support/helpers'

describe('A Cocooned setup', () => {
  given('template', () => `
    <section>
      <div>
        <a class="cocooned-add" href="#"
           data-association="items"
           data-template-id="template">Add</a>
        <template id="template">${given.insertionTemplate}</template>
      </div>
    </section>
  `)
  given('insertionTemplate', () => '<div class="cocooned-item"></div>')
  given('container', () => document.querySelector('section'))

  beforeEach(() => {
    document.body.innerHTML = given.template
    $(given.container).cocooned()
  })

  it('is instanciated as a Cocooned instance', () => {
    expect(given.container).toHaveClass('cocooned-container')
  })
})
