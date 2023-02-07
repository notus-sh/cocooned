/* global given */

import { coreMixin } from '@notus.sh/cocooned/src/cocooned/plugins/core'
import { Base } from '@notus.sh/cocooned/src/cocooned/base'
import { jest } from '@jest/globals'
import { faker } from '@cocooned/tests/support/faker'
import { clickEvent, getAddLink, getAddLinks, getRemoveLink } from '@cocooned/tests/support/helpers'

describe('coreMixin', () => {
  given('extended', () => coreMixin(Base))

  describe('selectors', () => {
    it('add add trigger selector', () => {
      expect(given.extended.selectors).toEqual(
        expect.objectContaining({ 'triggers.add': ['[data-cocooned-trigger="add"]', '.cocooned-add'] })
      )
    })

    it('add remove trigger selector', () => {
      expect(given.extended.selectors).toEqual(
        expect.objectContaining({ 'triggers.remove': ['[data-cocooned-trigger="remove"]', '.cocooned-remove'] })
      )
    })
  })

  describe('when instanciated', () => {
    beforeEach(() => {
      document.body.innerHTML = given.html
      given.instance.start()
    })

    given('instance', () => new given.extended(given.container, given.options)) // eslint-disable-line new-cap
    given('container', () => document.querySelector('[data-cocooned-container]'))
    given('template', () => '<div data-cocooned-item></div>')

    describe('with add triggers', () => {
      describe('when inside container', () => {
        given('html', () => `
          <div data-cocooned-container>
            <div>
              <a data-cocooned-trigger="add"
                 data-association="item"
                 data-template="template"
                 href="#">Add</a>
              <template data-name="template">${given.template}</template>
            </div>
          </div>
        `)

        it('binds add on add triggers', () => {
          const listener = jest.fn(e => e.preventDefault())
          given.container.addEventListener('cocooned:before-insert', listener)
          getAddLink(document).dispatchEvent(clickEvent())

          expect(listener).toHaveBeenCalled()
        })
      })

      describe('when outside container', () => {
        given('html', () => `
          <div data-cocooned-container class="container"></div>
          <a data-cocooned-trigger="add"
             data-association="item"
             data-template="template"
             data-association-insertion-node=".container"
             data-association-insertion-method="prepend"
             href="#">Add</a>
          <template data-name="template">${given.template}</template>
        `)

        it('binds add on add triggers', () => {
          const listener = jest.fn(e => e.preventDefault())
          given.container.addEventListener('cocooned:before-insert', listener)
          getAddLink(document).dispatchEvent(clickEvent())

          expect(listener).toHaveBeenCalled()
        })
      })

      describe('with multiple add triggers', () => {
        given('html', () => `
          <div data-cocooned-container class="container">
            <div>
              <a data-cocooned-trigger="add"
                 data-association="item"
                 data-template="template-inside"
                 href="#">Add</a>
              <template data-name="template-inside">${given.template}</template>
            </div>
          </div>
          <a data-cocooned-trigger="add"
             data-association="item"
             data-template="template-outside"
             data-association-insertion-node=".container"
             data-association-insertion-method="prepend"
             href="#">Add</a>
          <template data-name="template-outside">${given.template}</template>
        `)

        it('binds add on all add triggers', () => {
          const listener = jest.fn(e => e.preventDefault())
          given.container.addEventListener('cocooned:before-insert', listener)
          Array.from(getAddLinks(document)).forEach(trigger => trigger.dispatchEvent(clickEvent()))

          expect(listener).toHaveBeenCalledTimes(getAddLinks(document).length)
        })
      })
    })

    describe('with remove triggers', () => {
      given('count', () => faker.datatype.number({ min: 1, max: 5 }))
      given('template', () => `
        <div data-cocooned-item>
          <a data-cocooned-trigger="remove" class="dynamic" href="#">Remove</a>
        </div>
      `)
      given('html', () => `
        <div data-cocooned-container>
          ${Array.from(Array(given.count), () => given.template).join('\n')}
        </div>
      `)

      it('binds remove on remove triggers', () => {
        const listener = jest.fn(e => e.preventDefault())
        given.container.addEventListener('cocooned:before-remove', listener)
        getRemoveLink(document).dispatchEvent(clickEvent())

        expect(listener).toHaveBeenCalled()
      })
    })
  })
})
