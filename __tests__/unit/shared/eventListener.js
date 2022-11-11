/* global given, jQuery, jest */

module.exports = ({ listen, dispatch }) => {
  describe('when called', () => {
    it('receives the event as first argument', done => {
      const listener = jest.fn(e => {
        expect(e.detail.event).toBeInstanceOf(jQuery.Event)
        done()
      })

      listen(listener)
      dispatch()
    })

    it('receives the original event as event data', done => {
      const listener = jest.fn(e => {
        expect(e.detail.event.originalEvent).toBeInstanceOf(jQuery.Event)
        done()
      })

      listen(listener)
      dispatch()
    })

    it('receives the actioner link as event data', done => {
      const listener = jest.fn(e => {
        expect(e.detail.event.link).toBeInstanceOf(jQuery)
        done()
      })

      listen(listener)
      dispatch()
    })

    it('receives the Cocooned instance as event data', done => {
      const listener = jest.fn(e => {
        expect(e.detail.event.cocooned).toBe(given.cocooned)
        done()
      })

      listen(listener)
      dispatch()
    })

    it('receives the manipulated node as second argument', done => {
      const listener = jest.fn(e => {
        expect(e.detail.node).toBeInstanceOf(jQuery)
        done()
      })

      listen(listener)
      dispatch()
    })

    it('receives the Cocooned instance as third argument', done => {
      const listener = jest.fn(e => {
        expect(e.detail.cocooned).toBe(given.cocooned)
        done()
      })

      listen(listener)
      dispatch()
    })
  })
}
