/* global given */

import Cocooned from '@notus.sh/cocooned'
import { jest } from '@jest/globals'
import { clickEvent } from '@cocooned/tests/support/helpers'
import { getItem, getItems, getAddLink, getRemoveLink } from '@cocooned/tests/support/selectors'

describe('A basic Cocooned setup', () => {
  beforeEach(() => {
    document.body.innerHTML = given.html

    const cocooned = new Cocooned(given.container)
    cocooned.start()
  })

  given('template', () => '<div class="cocooned-item"></div>')
  given('existing', () => given.template)
  given('container', () => document.querySelector('section'))
  given('html', () => `
    <section>
      ${given.existing}

      <div>
        <a class="cocooned-add" href="#"
           data-association="items"
           data-template="template">Add</a>
        <template data-name="template">${given.template}</template>
      </div>
    </section>
  `)

  it('does not change container content', () => {
    expect(getItems(given.container).length).toEqual(1)
  })

  it('add a class to container', () => {
    expect(given.container.classList).toContain('cocooned-container')
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

    it('triggers a before-insert event', () => {
      const listener = jest.fn()
      given.container.addEventListener('cocooned:before-insert', listener)
      given.addLink.dispatchEvent(clickEvent())

      expect(listener).toHaveBeenCalled()
    })
  })

  describe('with items including a remove link', () => {
    given('template', () => `
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

        expect(getItems(given.container)).not.toContain(inserted)
      })

      it('triggers a before-remove event', () => {
        const listener = jest.fn()
        given.container.addEventListener('cocooned:before-remove', listener)
        given.removeLink.dispatchEvent(clickEvent())

        expect(listener).toHaveBeenCalled()
      })
    })

    describe('with existing items marked for destruction', () => {
      given('existing', () => `
        <div class="cocooned-item">
          <input type="hidden" name="list[items_attributes][0][_destroy]" value="true" />
          <a class="cocooned-remove existing destroyed" href="#">Remove</a>
        </div>
      `)
      given('item', () => document.querySelector('.cocooned-item'))

      it('hides those item when instanced', () => {
        expect(getItem(given.container).classList).toContain('cocooned-item--hidden')
      })
    })
  })
})
