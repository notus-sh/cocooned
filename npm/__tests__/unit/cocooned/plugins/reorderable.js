/* global given */

import { reorderableMixin } from '@notus.sh/cocooned/src/cocooned/plugins/reorderable'
import { Emitter } from '@notus.sh/cocooned/src/cocooned/events/emitter'
import { Selection } from '@notus.sh/cocooned/src/cocooned/selection'
import { jest } from '@jest/globals'
import { faker } from '@cocooned/tests/support/faker'
import { clickEvent } from '@cocooned/tests/support/helpers'
import { getMoveUpLink, getMoveDownLink } from '@cocooned/tests/support/selectors'

describe('reorderableMixin', () => {
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

    notify (target, eventType, eventDetails) {
      return given.emitter.emit(target, eventType, eventDetails)
    }

    _bindEvents () {}
  })
  given('extended', () => reorderableMixin(given.extendable))
  given('startAt', () => faker.datatype.number({ min: 2, max: 5 }))

  describe('defaultOptions', () => {
    it('merges default options', () => {
      expect(given.extended.defaultOptions()).toEqual(expect.objectContaining({ reorderable: false }))
    })
  })

  describe('_normalizeOptions', () => {
    it('does not change configuration when disabled', () => {
      expect(given.extended._normalizeOptions({ reorderable: false }))
        .toEqual(expect.objectContaining({ reorderable: false }))
    })

    it('does not change configuration when already normalized', () => {
      expect(given.extended._normalizeOptions({ reorderable: { startAt: given.startAt } }))
        .toEqual(expect.objectContaining({ reorderable: { startAt: given.startAt } }))
    })

    it('sets default value when enabled', () => {
      expect(given.extended._normalizeOptions({ reorderable: true }))
        .toEqual(expect.objectContaining({ reorderable: { startAt: 1 } }))
    })
  })

  describe('when instanciated', () => {
    beforeEach(() => {
      document.body.innerHTML = given.html
      const instance = new given.extended()
    })

    given('emitter', () => new Emitter())
    given('container', () => document.querySelector('.cocooned-container'))
    given('form', () => document.querySelector('form'))
    given('count', () => faker.datatype.number({ min: 2, max: 5 }))
    given('template', () => `
      <div class="cocooned-item">
        <a class="cocooned-move-up" href="#">Up</a>
        <a class="cocooned-move-down" href="#">Down</a>
        <input type="hidden" name="items[0][position]" />
      </div>
    `)
    given('html', () => `
      <form>
        <div class="cocooned-container">
          ${Array.from(Array(given.count), () => given.template).join('\n')}
        </div>
      </form>
    `)

    describe('when enabled', () => {
      given('options', () => ({ reorderable: { startAt: given.startAt } }))

      it('binds reindex after each insertion', () => {
        const listener = jest.fn(e => e.preventDefault())
        given.container.addEventListener('cocooned:before-reindex', listener)
        given.emitter.emit(given.container, 'after-insert')

        expect(listener).toHaveBeenCalled()
      })

      it('binds reindex after each removal', () => {
        const listener = jest.fn(e => e.preventDefault())
        given.container.addEventListener('cocooned:before-reindex', listener)
        given.emitter.emit(given.container, 'after-remove')

        expect(listener).toHaveBeenCalled()
      })

      it('binds reindex after each move', () => {
        const listener = jest.fn(e => e.preventDefault())
        given.container.addEventListener('cocooned:before-reindex', listener)
        given.emitter.emit(given.container, 'after-move')

        expect(listener).toHaveBeenCalled()
      })

      it('binds reindex before form submit', () => {
        const listener = jest.fn(e => e.preventDefault())
        given.container.addEventListener('cocooned:before-reindex', listener)
        given.form.dispatchEvent(new Event('submit'))

        expect(listener).toHaveBeenCalled()
      })

      it('binds move on move up triggers', () => {
        const listener = jest.fn(e => e.preventDefault())
        given.container.addEventListener('cocooned:before-move', listener)
        getMoveUpLink(given.container, given.count - 1).dispatchEvent(clickEvent())

        expect(listener).toHaveBeenCalled()
      })

      it('binds move on move down triggers', () => {
        const listener = jest.fn(e => e.preventDefault())
        given.container.addEventListener('cocooned:before-move', listener)
        getMoveDownLink(given.container, 0).dispatchEvent(clickEvent())

        expect(listener).toHaveBeenCalled()
      })
    })
  })
})
