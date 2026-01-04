/* global given */

import { Listener } from '@notus.sh/cocooned/src/cocooned/disposable/listener.js'
import { jest } from '@jest/globals'
import { clickEvent } from '@cocooned/tests/support/helpers'

describe('Listener', () => {
  beforeEach(() => { document.body.innerHTML = given.html })

  given('html', () => '<section><a href="#">Trigger</a></section>')
  given('trigger', () => document.querySelector('a'))

  it('setup event listener', () => {
    const callback = jest.fn()
    const disposableListener = new Listener(given.trigger, 'click', callback)
    given.trigger.dispatchEvent(clickEvent())

    expect(callback).toHaveBeenCalled()
  })

  describe('dispose', () => {
    it('remove event listener', () => {
      const callback = jest.fn()
      const disposableListener = new Listener(given.trigger, 'click', callback)
      disposableListener.dispose()
      given.trigger.dispatchEvent(clickEvent())

      expect(callback).not.toHaveBeenCalled()
    })

    it('does not fail if called more than once', () => {
      const callback = jest.fn()
      const disposableListener = new Listener(given.trigger, 'click', callback)
      disposableListener.dispose()

      expect(() => disposableListener.dispose()).not.toThrow()
    })
  })

  describe('with explicit resources management', () => {
    it('automatically remove event listener', () => {
      const callback = jest.fn()
      { using disposableListener = new Listener(given.trigger, 'click', callback) }
      given.trigger.dispatchEvent(clickEvent())

      expect(callback).not.toHaveBeenCalled()
    })
  })
})
