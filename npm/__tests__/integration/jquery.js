/* global given */

import jQuery from 'jquery'
import { jest } from '@jest/globals'
import { clickEvent, getAddLink } from '@cocooned/tests/support/helpers'

describe('A Cocooned setup with jQuery integration', () => {
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
  given('container', () => document.querySelector('[data-cocooned-container]'))

  beforeEach(async () => {
    document.body.innerHTML = given.html

    // Expose jQuery globally and call auto-start as Jquery ready event does not fire in jest-dom
    window.$ = window.jQuery = jQuery
    await import('@notus.sh/cocooned/jquery').then(({ cocoonedAutoStart }) => cocoonedAutoStart())
  })

  it('add a method to jQuery', () => {
    expect(jQuery.fn).toEqual(expect.objectContaining({ cocooned: expect.any(Function) }))
  })

  it('instanciates Cocooned instances on startup', () => {
    expect(given.container.dataset).toHaveProperty('cocoonedUuid')
  })

  describe('when an event is fired', () => {
    it('triggers jQuery event listeners', () => {
      const listener = jest.fn()
      jQuery(given.container).on('cocooned:before-insert', listener)
      getAddLink(given.container).dispatchEvent(clickEvent())

      expect(listener).toHaveBeenCalled()
    })
  })
})
