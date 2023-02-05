/* global given */

import { limitMixin } from '@notus.sh/cocooned/src/cocooned/plugins/limit'
import { Base } from '@notus.sh/cocooned/src/cocooned/base'
import { jest } from '@jest/globals'
import { faker } from '@cocooned/tests/support/faker'

describe('limitMixin', () => {
  given('extended', () => limitMixin(Base))
  given('limit', () => faker.datatype.number({ min: 2, max: 5 }))

  describe('defaultOptions', () => {
    it('merges default options', () => {
      expect(given.extended.defaultOptions()).toEqual(expect.objectContaining({ limit: false }))
    })
  })

  describe('when instanciated', () => {
    beforeEach(() => {
      document.body.innerHTML = given.html
      given.instance.start()
    })

    given('instance', () => new given.extended(given.container, given.options)) // eslint-disable-line new-cap
    given('container', () => document.querySelector('.cocooned-container'))
    given('count', () => faker.datatype.number({ min: 2, max: 5 }))
    given('template', () => '<div class="cocooned-item"></div>')
    given('html', () => `
      <div class="cocooned-container">
        ${Array.from(Array(given.count), () => given.template).join('\n')}
      </div>
    `)

    describe('when enabled', () => {
      given('options', () => ({ limit: given.count }))

      it('raises an event when limit is reached', () => {
        const listener = jest.fn()
        given.container.addEventListener('cocooned:limit-reached', listener)
        given.instance.notify(given.container, 'before-insert')

        expect(listener).toHaveBeenCalled()
      })

      it('prevents insertion', () => {
        return new Promise(resolve => {
          const listener = jest.fn(e => {
            expect(e.defaultPrevented).toBeTruthy()
            resolve()
          })
          given.container.addEventListener('cocooned:before-insert', listener)
          given.instance.notify(given.container, 'before-insert')
        })
      })
    })
  })
})
