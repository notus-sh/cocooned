/* global given */

import { default as Base } from '@notus.sh/cocooned'
import { useCocooned } from '@notus.sh/cocooned/src/integrations/stimulus/use'

describe('useCocooned', () => {
  beforeEach(() => document.body.innerHTML = given.html)

  given('container', () => document.querySelector('[data-cocooned-container]'))
  given('html', () => `<div data-cocooned-container></div>`)
  given('controller', () => ({ disconnect: () => {}, element: given.container }))

  describe('without options', () => {
    beforeEach(() => {
      useCocooned(given.controller)
    })

    it('associates a Cocooned instance to container', () => {
      expect(given.container.dataset).toEqual(expect.objectContaining({ cocoonedUuid: expect.any(String) }))
    })

    const events = [
      {
        eventName: 'cocooned:after-insert',
        methodName: 'afterInsert'
      },
      {
        eventName: 'cocooned:after-move',
        methodName: 'afterMove'
      },
      {
        eventName: 'cocooned:after-remove',
        methodName: 'afterRemove'
      },
      {
        eventName: 'cocooned:before-insert',
        methodName: 'beforeInsert'
      },
      {
        eventName: 'cocooned:before-move',
        methodName: 'beforeMove'
      },
      {
        eventName: 'cocooned:before-remove',
        methodName: 'beforeRemove'
      },
      {
        eventName: 'cocooned:limit-reached',
        methodName: 'limitReached'
      }
    ]

    describe.each(events)('with $eventName events', ({ eventName, methodName }) => {
      given('event', () => new CustomEvent(eventName, { bubbles: true, cancelable: true }))

      it('sets an event listener', () => {
        return new Promise(resolve => {
          given.controller[methodName] = () => resolve()
          given.container.dispatchEvent(given.event)
        })
      })
    })
  })

  describe('with a cocooned option', () => {
    beforeEach(() => {
      useCocooned(given.controller, { cocooned: given.cocooned })
    })

    given('cocooned', () => class Extended extends Base {
      static create (container, options) {
        const cocooned = new Extended(container, options)
        cocooned.start()
        return cocooned
      }
    })
    given('instance', () => Base.getInstance(given.container.dataset.cocoonedUuid))

    it('creates an instance of the given class', () => {
      expect(given.instance).toBeInstanceOf(given.cocooned)
    })
  })

  describe('with an element option', () => {
    beforeEach(() => {
      useCocooned(given.controller, { element: given.otherContainer })
    })

    given('otherContainer', () => document.querySelector('section'))
    given('html', () => `<div data-cocooned-container><section></section></div>`)

    it('associates a Cocooned instance to given element', () => {
      expect(given.otherContainer.dataset).toEqual(expect.objectContaining({ cocoonedUuid: expect.any(String) }))
    })
  })

  describe('with an events option', () => {
    beforeEach(() => {
      useCocooned(given.controller, { events: ['afterInsert'] })
    })

    given('afterInsertEvent', () => new CustomEvent('cocooned:after-insert', { bubbles: true, cancelable: true }))
    given('afterRemoveEvent', () => new CustomEvent('cocooned:after-remove', { bubbles: true, cancelable: true }))

    it('sets listener only for given events', () => {
      return new Promise((resolve, reject) => {
        given.controller.afterInsert = () => resolve()
        given.controller.afterRemove = () => reject()

        given.container.dispatchEvent(given.afterRemoveEvent)
        given.container.dispatchEvent(given.afterInsertEvent)
      })
    })
  })

  describe('with an options option', () => {
    beforeEach(() => {
      useCocooned(given.controller, { options: { duration: 12 } })
    })

    given('instance', () => Base.getInstance(given.container.dataset.cocoonedUuid))

    it('forwards options to Cocooned instantiation', () => {
      expect(given.instance.options).toEqual(expect.objectContaining({ duration: 12 }))
    })
  })
})
