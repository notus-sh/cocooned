/* eslint jest/no-export: "off" -- This is a shared examples */

import { Base as Cocooned } from '@notus.sh/cocooned/src/cocooned/base'
import { jest } from '@jest/globals'

export default ({ listen, dispatch, args = new Set(['link', 'node', 'cocooned']) }) => {
  describe('when triggered', () => {
    it('receives the original event as event detail', () => {
      return new Promise(resolve => {
        const listener = jest.fn(e => {
          expect(e).toHaveProperty('detail.originalEvent')
          expect(e.detail.originalEvent).toBeInstanceOf(Event)
          resolve()
        })

        listen(listener)
        dispatch()
      })
    })

    if (args.has('link')) {
      it('receives the actioner link as event data', () => {
        return new Promise(resolve => {
          const listener = jest.fn(e => {
            expect(e).toHaveProperty('detail.link')
            expect(e.detail.link).toBeInstanceOf(HTMLAnchorElement)
            resolve()
          })

          listen(listener)
          dispatch()
        })
      })
    }

    if (args.has('node')) {
      it('receives the manipulated node as event data', () => {
        return new Promise(resolve => {
          const listener = jest.fn(e => {
            expect(e).toHaveProperty('detail.node')
            expect(e.detail.node.classList).toContain('cocooned-item')
            resolve()
          })

          listen(listener)
          dispatch()
        })
      })
    }

    if (args.has('nodes')) {
      it('receives the manipulated nodes as event data', () => {
        return new Promise(resolve => {
          const listener = jest.fn(e => {
            expect(e).toHaveProperty('detail.nodes')

            e.detail.nodes.forEach(node => expect(node.classList).toContain('cocooned-item'))
            resolve()
          })

          listen(listener)
          dispatch()
        })
      })
    }

    if (args.has('cocooned')) {
      it('receives the Cocooned instance as event data', () => {
        return new Promise(resolve => {
          const listener = jest.fn(e => {
            expect(e).toHaveProperty('detail.cocooned')
            expect(e.detail.cocooned).toBeInstanceOf(Cocooned)
            resolve()
          })

          listen(listener)
          dispatch()
        })
      })
    }
  })
}
