/* global given */

import { limitMixin } from '@notus.sh/cocooned/src/cocooned/plugins/limit'
import { Emitter } from '@notus.sh/cocooned/src/cocooned/events/emitter'
import { Selection } from '@notus.sh/cocooned/src/cocooned/selection'
import { jest } from '@jest/globals'
import { faker } from '@cocooned/tests/support/faker'

describe('limitMixin', () => {
  // TODO: Remove once Cocooned Base will be rewritten.
  given('extendable', () => class Extendable {
    static defaultOptions () {
      return {}
    }

    static _normalizeOptions (options) {
      return options
    }

    constructor () {
      this._bindEvents()
    }

    get container () {
      return given.container
    }

    get options () {
      return given.options
    }

    get selection () {
      return new Selection(given.container)
    }

    notify(target, eventType, eventDetails) {
      return given.emitter.emit(target, eventType, eventDetails)
    }

    _bindEvents () {}
  })
  given('extended', () => limitMixin(given.extendable))
  given('limit', () => faker.datatype.number({ min: 2, max: 5 }))

  describe('defaultOptions', () => {
    it('merges default options', () => {
      expect(given.extended.defaultOptions()).toEqual(expect.objectContaining({ limit: false }))
    })
  })

  describe('when instanciated', () => {
    beforeEach(() => {
      document.body.innerHTML = given.html
      const instance = new given.extended()
    })

    given('emitter', () => new Emitter())
    given('container', () => document.querySelector('.cocooned-container'))
    given('count', () => faker.datatype.number({ min: 2, max: 5 }))
    given('template', () => `<div class="cocooned-item"></div>`)
    given('html', () => `
      <div class="cocooned-container">
        ${Array.from(Array(given.count), () => given.template).join("\n")}
      </div>
    `)

    describe('when enabled', () => {
      given('options', () => ({ limit: given.count }))

      it('raises an event when limit is reached', () => {
        const listener = jest.fn()
        given.container.addEventListener('cocooned:limit-reached', listener)
        given.emitter.emit(given.container, 'before-insert')

        expect(listener).toHaveBeenCalled()
      })

      it('prevents insertion', () => {
        return new Promise(resolve => {
          const listener = jest.fn(e => {
            expect(e.defaultPrevented).toBeTruthy()
            resolve()
          })
          given.container.addEventListener('cocooned:before-insert', listener)
          given.emitter.emit(given.container, 'before-insert')
        })
      })
    })
  })
})
