/* global given */

import Cocooned from '@notus.sh/cocooned/cocooned'
import { asAttribute } from '@cocooned/tests/support/helpers'

describe('A Cocoon setup', () => {
  given('template', () => `
    <section>
      <div>
        <a class="add_fields" href="#"
           data-association-insertion-template="${asAttribute(given.insertionTemplate)}">Add</a>
      </div>
    </section>
  `)
  given('insertionTemplate', () => '<div class="cocooned-item"></div>')
  given('container', () => document.querySelector('section'))

  beforeEach(async () => {
    document.body.innerHTML = given.template
    window.Cocooned = Cocooned
    await import('../../../../../app/assets/javascripts/cocoon')
  })

  it('is instanciated as a Cocooned instance', () => {
    expect(given.container).toHaveClass('cocooned-container')
  })
})
