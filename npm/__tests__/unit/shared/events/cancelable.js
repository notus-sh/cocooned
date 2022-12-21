/* global given, $ */
/* eslint jest/no-export: "off" -- This is a shared examples */

import { jest } from '@jest/globals'

export default ({ event, dispatch, trigger }) => {
  describe('a cancelable operation', () => {
    /* TODO: Enable once we moved out ot jQuery events. Temporary alternative below; */
    /* eslint-disable jest/no-disabled-tests, jest/no-identical-title */
    it.skip('is canceled if propagation of the before event is stopped', () => {
      const canceler = jest.fn(e => e.stopPropagation())
      given.container.addEventListener(`$cocooned:before-${event}`, canceler)

      const listener = jest.fn()
      given.container.addEventListener(`$cocooned:after-${event}`, listener)
      dispatch()

      expect(listener).not.toHaveBeenCalled()
    })
    /* eslint-enable jest/no-disabled-tests */

    it('is canceled if propagation of the before event is stopped', () => {
      const canceler = jest.fn(e => e.stopPropagation())
      $(given.container).on(`cocooned:before-${event}`, canceler)

      const listener = jest.fn(e => e.stopPropagation())
      $(given.container).on(`cocooned:after-${event}`, listener)
      trigger()

      expect(listener).not.toHaveBeenCalled()
    })
    /* eslint-enable jest/no-identical-title */

    /* TODO: Enable once we moved out ot jQuery events. Temporary alternative below; */
    /* eslint-disable jest/no-disabled-tests, jest/no-identical-title */
    it.skip('is canceled if default behavior of the before event is prevented', () => {
      const canceler = jest.fn(e => e.preventDefault())
      given.container.addEventListener(`$cocooned:before-${event}`, canceler)

      const listener = jest.fn()
      given.container.addEventListener(`$cocooned:after-${event}`, listener)
      dispatch()

      expect(listener).not.toHaveBeenCalled()
    })
    /* eslint-enable jest/no-disabled-tests */

    it('is canceled if default behavior of the before event is prevented', () => {
      const canceler = jest.fn(e => e.preventDefault())
      $(given.container).on(`cocooned:before-${event}`, canceler)

      const listener = jest.fn()
      $(given.container).on(`cocooned:after-${event}`, listener)
      trigger()

      expect(listener).not.toHaveBeenCalled()
    })
    /* eslint-enable jest/no-identical-title */
  })
}
