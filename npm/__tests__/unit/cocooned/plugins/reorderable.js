/* global given */

import { reorderableMixin } from '@notus.sh/cocooned/src/cocooned/plugins/reorderable'
import { Base } from '@notus.sh/cocooned/src/cocooned/base'
import { jest } from '@jest/globals'
import { faker } from '@cocooned/tests/support/faker'
import { clickEvent, getMoveUpLink, getMoveDownLink } from '@cocooned/tests/support/helpers'

describe('reorderableMixin', () => {
  given('extended', () => reorderableMixin(Base))
  given('startAt', () => faker.datatype.number({ min: 2, max: 5 }))

  describe('defaultOptions', () => {
    it('merges default options', () => {
      expect(given.extended.defaultOptions).toEqual(expect.objectContaining({ reorderable: false }))
    })
  })

  describe('selectors', () => {
    it('add up trigger selector', () => {
      expect(given.extended.selectors).toEqual(
        expect.objectContaining({ 'triggers.up': ['[data-cocooned-trigger="up"]', '.cocooned-move-up'] })
      )
    })

    it('add down trigger selector', () => {
      expect(given.extended.selectors).toEqual(
        expect.objectContaining({ 'triggers.down': ['[data-cocooned-trigger="down"]', '.cocooned-move-down'] })
      )
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
      given.instance.start()
    })

    given('instance', () => new given.extended(given.container, given.options)) // eslint-disable-line new-cap
    given('container', () => document.querySelector('[data-cocooned-container]'))
    given('form', () => document.querySelector('form'))
    given('count', () => faker.datatype.number({ min: 2, max: 5 }))
    given('template', () => `
      <div data-cocooned-item>
        <a data-cocooned-trigger="up" href="#">Up</a>
        <a data-cocooned-trigger="down" href="#">Down</a>
        <input type="hidden" name="items[0][position]" />
      </div>
    `)
    given('html', () => `
      <form>
        <div data-cocooned-container>
          ${Array.from(Array(given.count), () => given.template).join('\n')}
        </div>
      </form>
    `)

    describe('when enabled', () => {
      given('options', () => ({ reorderable: { startAt: given.startAt } }))

      it('binds reindex after each insertion', () => {
        const listener = jest.fn(e => e.preventDefault())
        given.container.addEventListener('cocooned:before-reindex', listener)
        given.instance.notify(given.container, 'after-insert')

        expect(listener).toHaveBeenCalled()
      })

      it('binds reindex after each removal', () => {
        const listener = jest.fn(e => e.preventDefault())
        given.container.addEventListener('cocooned:before-reindex', listener)
        given.instance.notify(given.container, 'after-remove')

        expect(listener).toHaveBeenCalled()
      })

      it('binds reindex after each move', () => {
        const listener = jest.fn(e => e.preventDefault())
        given.container.addEventListener('cocooned:before-reindex', listener)
        given.instance.notify(given.container, 'after-move')

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
