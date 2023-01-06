/* global given */

import EmitterDecorator from '@notus.sh/cocooned/src/integrations/jquery/emitterDecorator'
import Emitter from '@notus.sh/cocooned/src/cocooned/emitter'
import { jest } from '@jest/globals'

import itBehavesLikeAnEventEmitter from '@cocooned/tests/shared/events/emitter'

describe('Emitter', () => {
  itBehavesLikeAnEventEmitter({ emitter: (namespaces) => new EmitterDecorator(new Emitter(namespaces), $) })

  describe('a jQuery event emitter', () => {
    beforeEach(() => document.body.innerHTML = `<section></section>`)

    beforeEach(() => delegate('cocooned:event', ['event', 'a', 'b']))
    afterEach(() => abnegate('cocooned:event', ['event', 'a', 'b']))

    given('container', () => document.querySelector('section'))
    given('emitter', () => new EmitterDecorator(new Emitter(), $))
    given('detail', () => ({ a: 1, b: 2 }))

    it('emits jQuery events', () => {
      const listener = jest.fn()
      given.container.addEventListener('$cocooned:event', listener)
      given.emitter.emit(given.container, 'event', given.detail)

      expect(listener).toHaveBeenCalled()
    })

    it('emits jQuery events with arguments', () => {
      return new Promise(resolve => {
        const listener = jest.fn(e => {
          expect(Object.keys(e.detail)).toEqual(['event'].concat(Object.keys(given.detail)))
          resolve()
        })

        given.container.addEventListener('$cocooned:event', listener)
        given.emitter.emit(given.container, 'event', given.detail)
      })
    })

    it('returns false if default is prevented', () => {
      $(given.container).on(`cocooned:event`, e => e.preventDefault())
      expect(given.emitter.emit(given.container, 'event')).toBeFalsy()
    })

    describe('with multiple namespaces', () => {
      const namespaces = ['one', 'any']

      beforeEach(() => namespaces.forEach(ns => delegate(`${ns}:event`)))
      afterEach(() => namespaces.forEach(ns => abnegate(`${ns}:event`)))

      given('emitter', () => new EmitterDecorator(new Emitter(namespaces), $))

      describe.each(namespaces)('for each namespace', (namespace) => {
        it('emits jQuery events', () => {
          const listener = jest.fn()
          given.container.addEventListener(`$${namespace}:event`, listener)
          given.emitter.emit(given.container, 'event')

          expect(listener).toHaveBeenCalled()
        })

        it('returns false if default is prevented', () => {
          namespaces.forEach(ns => {
            $(given.container).on(`${ns}:event`, e => (namespace === ns) && e.preventDefault())
          })

          expect(given.emitter.emit(given.container, 'event')).toBeFalsy()
        })
      })
    })
  })
})
