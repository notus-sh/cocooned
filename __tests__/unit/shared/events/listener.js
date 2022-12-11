/* global given, jQuery, jest */
/* eslint jest/no-export: "off" -- This is a shared examples */

module.exports = ({ listen, dispatch, args = new Set(['link', 'node', 'cocooned']) }) => {
  describe('when triggered', () => {
    it('receives the event as first argument', done => {
      const listener = jest.fn(e => {
        expect(e).toHaveProperty('detail.event')
        expect(e.detail.event).toBeInstanceOf(jQuery.Event)
        done()
      })

      listen(listener)
      dispatch()
    })

    it('receives the original event as event data', done => {
      const listener = jest.fn(e => {
        expect(e).toHaveProperty('detail.event.originalEvent')
        expect(e.detail.event.originalEvent).toBeInstanceOf(jQuery.Event)
        done()
      })

      listen(listener)
      dispatch()
    })

    if (args.has('link')) {
      it('receives the actioner link as event data', done => {
        const listener = jest.fn(e => {
          expect(e).toHaveProperty('detail.event.link')
          expect(e.detail.event.link).toBeInstanceOf(jQuery)
          done()
        })

        listen(listener)
        dispatch()
      })
    }

    if (args.has('node')) {
      it('receives the manipulated node as event data', done => {
        const listener = jest.fn(e => {
          expect(e).toHaveProperty('detail.event.node')
          expect(e.detail.event.node).toBeInstanceOf(jQuery)
          done()
        })

        listen(listener)
        dispatch()
      })

      it('receives the manipulated node as second argument', done => {
        const listener = jest.fn(e => {
          expect(e).toHaveProperty('detail.node')
          expect(e.detail.node).toBeInstanceOf(jQuery)
          done()
        })

        listen(listener)
        dispatch()
      })
    }

    if (args.has('nodes')) {
      it('receives the manipulated nodes as event data', done => {
        const listener = jest.fn(e => {
          expect(e).toHaveProperty('detail.event.nodes')
          expect(e.detail.event.nodes).toBeInstanceOf(jQuery)
          done()
        })

        listen(listener)
        dispatch()
      })

      it('receives the manipulated nodes as second argument', done => {
        const listener = jest.fn(e => {
          expect(e).toHaveProperty('detail.event.nodes')
          expect(e.detail.nodes).toBeInstanceOf(jQuery)
          done()
        })

        listen(listener)
        dispatch()
      })
    }

    if (args.has('cocooned')) {
      it('receives the Cocooned instance as event data', done => {
        const listener = jest.fn(e => {
          expect(e).toHaveProperty('detail.event.cocooned')
          expect(e.detail.event.cocooned).toBe(given.cocooned)
          done()
        })

        listen(listener)
        dispatch()
      })

      it('receives the Cocooned instance as third argument', done => {
        const listener = jest.fn(e => {
          expect(e).toHaveProperty('detail.cocooned')
          expect(e.detail.cocooned).toBe(given.cocooned)
          done()
        })

        listen(listener)
        dispatch()
      })
    }
  })
}
