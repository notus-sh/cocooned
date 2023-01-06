/* global given */
/* eslint jest/no-export: "off" -- This is a shared examples */

import { jest } from '@jest/globals'

export default ({ emitter }) => {
  describe('an event emitter', () => {
    beforeEach(() => document.body.innerHTML = `<section></section>`)

    given('container', () => document.querySelector('section'))
    given('emitter', () => emitter())

    it('emits custom events', () => {
      const listener = jest.fn()
      given.container.addEventListener('cocooned:event', listener)
      given.emitter.emit(given.container, 'event')

      expect(listener).toHaveBeenCalled()
    })

    it('emits custom events with details', () => {
      return new Promise(resolve => {
        const detail = { a: 1 }
        const listener = jest.fn(e => {
          expect(e.detail).toEqual(detail)
          resolve()
        })

        given.container.addEventListener('cocooned:event', listener)
        given.emitter.emit(given.container, 'event', detail)
      })
    })

    it('returns false if default is prevented', () => {
      given.container.addEventListener('cocooned:event', e => e.preventDefault())
      expect(given.emitter.emit(given.container, 'event')).toBeFalsy()
    })

    describe('with multiple namespaces', () => {
      const namespaces = ['one', 'any']
      given('emitter', () => emitter(namespaces))

      describe.each(namespaces)('for each namespace', (namespace) => {
        it('emits custom events', () => {
          const listener = jest.fn()
          given.container.addEventListener(`${namespace}:event`, listener)
          given.emitter.emit(given.container, 'event')

          expect(listener).toHaveBeenCalled()
        })

        it('returns false if default is prevented', () => {
          namespaces.forEach(ns => {
            given.container.addEventListener(`${ns}:event`, e => (namespace === ns) && e.preventDefault())
          })

          expect(given.emitter.emit(given.container, 'event')).toBeFalsy()
        })
      })
    })
  })
}
