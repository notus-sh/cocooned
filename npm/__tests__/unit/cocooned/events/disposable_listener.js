/* global given */

import { DisposableListener } from '@notus.sh/cocooned/src/cocooned/events/disposable_listener'
import { jest } from '@jest/globals'
import { clickEvent } from '@cocooned/tests/support/helpers'

describe('DisposableListener', () => {
  beforeEach(() => { document.body.innerHTML = given.html })

  given('html', () => '<section><a href="#">Trigger</a></section>')
  given('trigger', () => document.querySelector('a'))

  it('setup event listener', () => {
    const listener = jest.fn()
    const disposableListener = new DisposableListener(given.trigger, 'click', listener)
    given.trigger.dispatchEvent(clickEvent())

    expect(listener).toHaveBeenCalled()
  })

  describe('dispose', () => {
    it('remove event listener', () => {
      const listener = jest.fn()
      const disposableListener = new DisposableListener(given.trigger, 'click', listener)
      disposableListener.dispose()
      given.trigger.dispatchEvent(clickEvent())

      expect(listener).not.toHaveBeenCalled()
    })

    it('does not fail if called more than once', () => {
      const listener = jest.fn()
      const disposableListener = new DisposableListener(given.trigger, 'click', listener)
      disposableListener.dispose()

      expect(() => disposableListener.dispose()).not.toThrow()
    })
  })

  describe('with explicit resources management', () => {
    it('automatically remove event listener', () => {
      const listener = jest.fn()
      { using disposableListener = new DisposableListener(given.trigger, 'click', listener) }
      given.trigger.dispatchEvent(clickEvent())

      expect(listener).not.toHaveBeenCalled()
    })
  })
})
