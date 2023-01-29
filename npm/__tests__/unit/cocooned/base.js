/* global given */

import { Base as Cocooned } from '@notus.sh/cocooned/src/cocooned/base'
import { jest } from '@jest/globals'
import { faker } from '@cocooned/tests/support/faker'
import { clickEvent } from "@cocooned/tests/support/helpers"
import { getItem, getAddLinks, getAddLink, getRemoveLink } from '@cocooned/tests/support/selectors'

describe('Cocooned', () => {
  beforeEach(() => {
    document.body.innerHTML = given.html
    const cocooned = new Cocooned(given.container)
    cocooned.start()
  })

  given('container', () => document.querySelector('.cocooned-container'))
  given('count', () => faker.datatype.number({ min: 1, max: 5 }))
  given('template', () => `
    <div class="cocooned-item">
      <a class="cocooned-remove dynamic" href="#">Remove</a>
    </div>
  `)
  given('html', () => `
    <div class="cocooned-container">
      <div>
        <a class="cocooned-add"
           data-association="item"
           data-template="template"
           href="#">Add</a>
      </div>
      <template data-name="template">${given.template}</template>
    </div>
  `)

  describe('with add triggers', () => {
    describe('when inside container', () => {
      given('html', () => `
        <div class="cocooned-container">
          <div>
            <a class="cocooned-add"
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
        <div class="cocooned-container"></div>
        <a class="cocooned-add"
           data-association="item"
           data-template="template"
           data-association-insertion-node=".cocooned-container"
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
        <div class="cocooned-container">
          <div>
            <a class="cocooned-add"
               data-association="item"
               data-template="template-inside"
               href="#">Add</a>
            <template data-name="template-inside">${given.template}</template>
          </div>
        </div>
        <a class="cocooned-add"
           data-association="item"
           data-template="template-outside"
           data-association-insertion-node=".cocooned-container"
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
    given('template', () => `
      <div class="cocooned-item">
        <a class="cocooned-remove dynamic" href="#">Remove</a>
      </div>
    `)
    given('html', () => `
      <div class="cocooned-container">
        ${Array.from(Array(given.count), () => given.template).join("\n")}
      </div>
    `)

    it('binds remove on remove triggers', () => {
      const listener = jest.fn(e => e.preventDefault())
      given.container.addEventListener('cocooned:before-remove', listener)
      getRemoveLink(document).dispatchEvent(clickEvent())

      expect(listener).toHaveBeenCalled()
    })
  })

  describe('with items marked for destruction', () => {
    given('html', () => `
      <div class="cocooned-container">
        <div class="cocooned-item">
          <a class="cocooned-remove existing destroyed" href="#">Remove</a>
          <input type="hidden" name="items[0][_destroy]" value="true" />
        </div>
      </div>
    `)

    it('hides them', () => {
      expect(getItem(document).classList).toContain('cocooned-item--hidden')
    })
  })
})
