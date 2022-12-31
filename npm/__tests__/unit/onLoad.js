/* global given */

describe('A Cocooned setup with cocooned-options', () => {
  given('template', () => `
    <section data-cocooned-options="{}">
      <div>
        <a class="cocooned-add" href="#"
           data-association="items"
           data-template="template">Add</a>
        <template data-name="template">${given.insertionTemplate}</template>
      </div>
    </section>
  `)
  given('insertionTemplate', () => '<div class="cocooned-item"></div>')
  given('container', () => document.querySelector('section'))

  beforeEach(async () => {
    document.body.innerHTML = given.template
    await import('@notus.sh/cocooned/cocooned')
  })

  it('is instanciated as a Cocooned instance', () => {
    expect(given.container).toHaveClass('cocooned-container')
  })
})
