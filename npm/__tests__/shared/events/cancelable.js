/* global given */
/* eslint jest/no-export: "off" -- This is a shared examples */

import { jest } from '@jest/globals'

export default ({ event, dispatch }) => {
  describe('a cancelable operation', () => {
    it('is canceled if default behavior of the before event is prevented', () => {
      const canceler = jest.fn(e => e.preventDefault())
      given.container.addEventListener(`cocooned:before-${event}`, canceler)

      const listener = jest.fn()
      given.container.addEventListener(`cocooned:after-${event}`, listener)
      dispatch()

      expect(listener).not.toHaveBeenCalled()
    })
  })
}
