/* global given */

const { asAttribute } = require('@cocooned/tests/support/helpers')

describe('A Cocooned setup with cocooned-options', () => {
  given('template', () => `
    <section data-cocooned-options="{}">
      <div>
        <a class="cocooned-add" href="#"
           data-association-insertion-template="${asAttribute(given.insertionTemplate)}">Add</a>
      </div>
    </section>
  `)
  given('insertionTemplate', () => '<div class="cocooned-item"></div>')
  given('container', () => document.querySelector('section'))

  beforeEach(() => {
    document.body.innerHTML = given.template
    require('../../app/assets/javascripts/cocooned')
  })

  it('is instanciated as a Cocooned instance', () => {
    expect(given.container).toHaveClass('cocooned-container')
  })
})
