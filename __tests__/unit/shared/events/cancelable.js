/* global given, jQuery, jest */

const {clickEvent} = require("../../../support/helpers");
module.exports = ({ event, dispatch, trigger }) => {
  describe('a cancelable operation', () => {
    // See jQuery alternative below
    it.skip('is canceled if propagation of the before event is stopped', () => {
      const canceler = jest.fn(e => e.stopPropagation())
      given.container.addEventListener(`$cocooned:before-${event}`, canceler)

      const listener = jest.fn()
      given.container.addEventListener(`$cocooned:after-${event}`, listener)
      dispatch()

      expect(listener).not.toHaveBeenCalled()
    })

    it('is canceled if propagation of the before event is stopped', () => {
      const canceler = jest.fn(e => e.stopPropagation())
      $(given.container).on(`cocooned:before-${event}`, canceler)

      const listener = jest.fn(e => e.stopPropagation())
      $(given.container).on(`cocooned:after-${event}`, listener)
      trigger()

      expect(listener).not.toHaveBeenCalled()
    })

    // See jQuery alternative below
    it.skip('is canceled if default behavior of the before event is prevented', () => {
      const canceler = jest.fn(e => e.preventDefault())
      given.container.addEventListener(`$cocooned:before-${event}`, canceler)

      const listener = jest.fn()
      given.container.addEventListener(`$cocooned:after-${event}`, listener)
      dispatch()

      expect(listener).not.toHaveBeenCalled()
    })

    it('is canceled if default behavior of the before event is prevented', () => {
      const canceler = jest.fn(e => e.preventDefault())
      $(given.container).on(`cocooned:before-${event}`, canceler)

      const listener = jest.fn()
      $(given.container).on(`cocooned:after-${event}`, listener)
      trigger()

      expect(listener).not.toHaveBeenCalled()
    })
  })
}
