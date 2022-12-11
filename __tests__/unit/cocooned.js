/* global given */

const Cocooned = require('@cocooned/src/javascripts/cocooned')
const { setup, asAttribute, clickEvent } = require('@cocooned/tests/support/helpers')
const { getItems, getAddLink, getRemoveLink } = require('@cocooned/tests/support/selectors')

describe('A basic Cocooned setup', () => {
  given('template', () => `
    <section>
      ${given.existing}

      <div>
        <a class="cocooned-add" href="#"
           data-associations="items"
           data-association-insertion-template="${asAttribute(given.insertionTemplate)}">Add</a>
      </div>
    </section>
  `)
  given('insertionTemplate', () => '<div class="cocooned-item"></div>')
  given('existing', () => given.insertionTemplate)
  given('container', () => document.querySelector('section'))
  given('cocooned', () => new Cocooned(given.container))

  beforeEach(() => setup(document, given))

  it('does not change container content', () => {
    expect(getItems(given.container).length).toEqual(1)
  })

  it('associates itself with container', () => {
    expect(given.container.dataset).toHaveProperty('cocooned')
  })

  it('add an ID to container', () => {
    expect(given.container).toHaveAttribute('id')
  })

  it('add a class to container', () => {
    expect(given.container).toHaveClass('cocooned-container')
  })

  describe('when add link is clicked', () => {
    given('addLink', () => getAddLink(given.container))

    it('adds an item to the container', () => {
      given.addLink.dispatchEvent(clickEvent())

      expect(getItems(given.container).length).toEqual(2)
    })

    it('adds an item to the container every time it is clicked', () => {
      given.addLink.dispatchEvent(clickEvent())
      given.addLink.dispatchEvent(clickEvent())

      expect(getItems(given.container).length).toEqual(3)
    })
  })

  describe('with items including a remove link', () => {
    given('insertionTemplate', () => `
      <div class="cocooned-item">
        <a class="cocooned-remove dynamic" href="#">Remove</a>
      </div>
    `)

    describe('when remove link is clicked', () => {
      given('addLink', () => getAddLink(given.container))
      given('removeLink', () => getRemoveLink(given.container))

      it('removes an item from the container', () => {
        given.removeLink.dispatchEvent(clickEvent())

        expect(getItems(given.container).length).toEqual(0)
      })

      it('removes only one item from the container', () => {
        given.addLink.dispatchEvent(clickEvent())
        given.removeLink.dispatchEvent(clickEvent())

        expect(getItems(given.container).length).toEqual(1)
      })

      it('removes the correct item from the container', () => {
        given.addLink.dispatchEvent(clickEvent())
        const inserted = Array.from(getItems(given.container)).pop()
        getRemoveLink(inserted).dispatchEvent(clickEvent())

        expect(inserted).not.toBeInTheDocument()
      })
    })

    describe('with existing items marked for destruction', () => {
      given('insertionTemplate', () => `
        <div class="cocooned-item">
          <input type="hidden" name="list[items_attributes][new_items][_destroy]" />
          <a class="cocooned-remove dynamic" href="#">Remove</a>
        </div>
      `)
      given('existing', () => `
        <div class="cocooned-item">
          <input type="hidden" name="list[items_attributes][0][_destroy]" />
          <a class="cocooned-remove existing destroyed" href="#">Remove</a>
        </div>
      `)
      given('item', () => document.querySelector('.cocooned-item'))

      it('hides those item when instanced', () => {
        expect(given.item).not.toBeVisible()
      })
    })
  })
})
