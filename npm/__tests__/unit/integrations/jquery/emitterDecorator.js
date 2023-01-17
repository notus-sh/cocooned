/* global given */

import EmitterDecorator from '@notus.sh/cocooned/src/integrations/jquery/emitterDecorator'
import Emitter from '@notus.sh/cocooned/src/cocooned/emitter'
import $ from 'jquery'
import { jest } from '@jest/globals'

import itBehavesLikeAnEventEmitter from '@cocooned/tests/shared/events/emitter'

describe('Emitter', () => {
  itBehavesLikeAnEventEmitter({ emitter: (namespaces) => new EmitterDecorator(new Emitter(namespaces), $) })

  describe('a jQuery event emitter decorator', () => {
    beforeEach(() => document.body.innerHTML = `<section></section>`)

    given('container', () => document.querySelector('section'))
    given('emitter', () => new EmitterDecorator({ emitted: () => [new CustomEvent('cocooned:event')] }, $))

    it('triggers jQuery event listeners', () => {
      const listener = jest.fn()
      $(given.container).on('cocooned:event', listener)
      given.emitter.emit(given.container, 'event')

      expect(listener).toHaveBeenCalled()
    })

    it('does not trigger native event listeners', () => {
      const listener = jest.fn()
      given.container.addEventListener('cocooned:event', listener)
      given.emitter.emit(given.container, 'event')

      expect(listener).not.toHaveBeenCalled()
    })

    it('emits jQuery events', () => {
      return new Promise(resolve => {
        const listener = jest.fn(e => {
          expect(e).toBeInstanceOf($.Event)
          resolve()
        })

        $(given.container).on('cocooned:event', listener)
        given.emitter.emit(given.container, 'event')
      })
    })

    it('emits jQuery events with arguments', () => {
      return new Promise(resolve => {
        const detail = { a: 1, b: 2 }
        const listener = jest.fn((e, ...args) => {
          expect(args).toEqual(expect.arrayContaining(Object.values(detail)))
          resolve()
        })

        $(given.container).on('cocooned:event', listener)
        given.emitter.emit(given.container, 'event', detail)
      })
    })

    it('emits jQuery events with data', () => {
      return new Promise(resolve => {
        const detail = { a: 1, b: 2 }
        const listener = jest.fn((e, ...args) => {
          expect(e).toHaveProperty('a', detail.a)
          expect(e).toHaveProperty('b', detail.b)
          resolve()
        })

        $(given.container).on('cocooned:event', listener)
        given.emitter.emit(given.container, 'event', detail)
      })
    })

    it('returns false if default is prevented', () => {
      $(given.container).on('cocooned:event', e => e.preventDefault())
      expect(given.emitter.emit(given.container, 'event')).toBeFalsy()
    })

    describe('with multiple namespaces', () => {
      const namespaces = ['one', 'any']

      given('emitter', () => {
        return new EmitterDecorator({ emitted: () => namespaces.map(ns => new CustomEvent(`${ns}:event`)) }, $)
      })

      describe.each(namespaces)('for each namespace', (namespace) => {
        it('emits jQuery events', () => {
          const listener = jest.fn()
          $(given.container).on(`${namespace}:event`, listener)
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

    describe('with a decorated native emitter', () => {
      given('emitter', () => new EmitterDecorator(new Emitter(), $))

      it('triggers native event listeners once', () => {
        const listener = jest.fn()
        given.container.addEventListener('cocooned:event', listener)
        given.emitter.emit(given.container, 'event')

        expect(listener).toHaveBeenCalledTimes(1)
      })

      /**
       * `target.dispatchEvent(e)` triggers both native and jQuery event listeners but
       * no additional arguments can be send.
       *
       * `$(target).trigger(e)` triggers only jQuery listeners and they will receive a
       * jQuery.event (and potential additional arguments) instead of a single
       * CustomEvent.
       *
       * As we can not discriminate native and jQuery listeners from emitter's (nor
       * event's) point of view, native event listeners are called twice when emitter
       * is decorated for jQuery.
       */
      it.failing('triggers jQuery event listeners once', () => {
        const listener = jest.fn()
        $(given.container).on('cocooned:event', listener)
        given.emitter.emit(given.container, 'event')

        expect(listener).toHaveBeenCalledTimes(1)
      })

      it('triggers only native event listeners if propagation is stopped', () => {
        const listener = jest.fn(e => e.stopPropagation())
        $(given.container).on('cocooned:event', listener)
        given.emitter.emit(given.container, 'event')

        expect(listener).toHaveBeenCalledTimes(1)
      })
    })
  })
})
