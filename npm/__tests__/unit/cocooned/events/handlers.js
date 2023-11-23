/* global given */

import {
  clickHandler,
  delegatedClickHandler,
  itemDelegatedClickHandler
} from '@notus.sh/cocooned/src/cocooned/events/handlers'
import { jest } from '@jest/globals'
import { clickEvent } from '@cocooned/tests/support/helpers'

describe('handlers', () => {
  beforeEach(() => { document.body.innerHTML = given.html })

  given('html', () => '<section><a data-trigger class="trigger" href="#"><span>Inner</span> Trigger</a></section>')
  given('container', () => document.querySelector('section'))
  given('trigger', () => document.querySelector('a'))
  given('innerTrigger', () => document.querySelector('span'))

  describe('clickHandler', () => {
    it('prevents event default behavior', () => {
      return new Promise(resolve => {
        const listener = jest.fn(e => {
          expect(e.defaultPrevented).toBeTruthy()
          resolve()
        })

        given.trigger.addEventListener('click', clickHandler(listener))
        given.trigger.dispatchEvent(clickEvent())
      })
    })
  })

  describe('delegatedClickHandler', () => {
    it('set up event delegations', () => {
      const listener = jest.fn()
      given.container.addEventListener('click', delegatedClickHandler('.trigger', listener))
      given.trigger.dispatchEvent(clickEvent())

      expect(listener).toHaveBeenCalled()
    })

    it('accepts attribute selector', () => {
      const listener = jest.fn()
      given.container.addEventListener('click', delegatedClickHandler('*[data-trigger]', listener))
      given.trigger.dispatchEvent(clickEvent())

      expect(listener).toHaveBeenCalled()
    })

    it('accepts events triggered on nested targets', () => {
      const listener = jest.fn()
      given.container.addEventListener('click', delegatedClickHandler('*[data-trigger]', listener))
      given.innerTrigger.dispatchEvent(clickEvent())

      expect(listener).toHaveBeenCalled()
    })

    it('set up event delegations correctly', () => {
      const listener = jest.fn()
      given.container.addEventListener('click', delegatedClickHandler('.another', listener))
      given.trigger.dispatchEvent(clickEvent())

      expect(listener).not.toHaveBeenCalled()
    })

    it('prevents event default behavior', () => {
      return new Promise(resolve => {
        const listener = jest.fn(e => {
          expect(e.defaultPrevented).toBeTruthy()
          resolve()
        })

        given.container.addEventListener('click', delegatedClickHandler('.trigger', listener))
        given.trigger.dispatchEvent(clickEvent())
      })
    })
  })

  describe('itemDelegatedClickHandler', () => {
    given('contains', () => jest.fn().mockReturnValue(true))
    given('cocooned', () => ({ contains: given.contains }))

    it('set up event delegations', () => {
      const listener = jest.fn()
      given.container.addEventListener('click', itemDelegatedClickHandler(given.cocooned, '.trigger', listener))
      given.trigger.dispatchEvent(clickEvent())

      expect(listener).toHaveBeenCalled()
    })

    describe('when cocooned instance does not contain event target', () => {
      given('contains', () => jest.fn().mockReturnValue(false))

      it('prevents callback', () => {
        const listener = jest.fn()
        given.container.addEventListener('click', itemDelegatedClickHandler(given.cocooned, '.trigger', listener))
        given.trigger.dispatchEvent(clickEvent())

        expect(listener).not.toHaveBeenCalled()
      })
    })
  })
})
