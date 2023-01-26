/* global given */

import { Base as Cocooned } from '@notus.sh/cocooned/src/cocooned/base'
import { Builder } from '@notus.sh/cocooned/src/cocooned/builder'
import { Add } from '@notus.sh/cocooned/src/cocooned/triggers/add'
import { jest } from '@jest/globals'
import { faker } from '@cocooned/tests/support/faker'
import { clickEvent } from '@cocooned/tests/support/helpers'
import { getItems, getAddLink } from '@cocooned/tests/support/selectors'

import itBehavesLikeAnEventListener from "@cocooned/tests/shared/events/customListener"
import itBehavesLikeACancellableEvent from "@cocooned/tests/shared/events/cancelable"

describe('Add', () => {
  beforeEach(() => document.body.innerHTML = given.html)

  given('add', () => new Add(given.addTrigger, new Cocooned(given.container), given.options))
  given('addTrigger', () => getAddLink(given.container))
  given('container', () => document.querySelector('.cocooned-container'))
  given('builder', () => {
    const template = document.querySelector(`template[data-name="template"]`)
    return new Builder(template.content, `new_item`)
  })
  given('options', () => ({ builder: given.builder, node: given.addTrigger.parentElement, method: 'before' }))

  given('template', () => '<div class="cocooned-item"></div>')
  given('html', () => `
    <div class="cocooned-container">
      <div>
        <a class="cocooned-add" href="#">Add</a>
      </div>
    </div>
    <template data-name="template">${given.template}</template>
  `)

  describe('when created', () => {
    describe('with invalid options', () => {
      given('options', () => ({ builder: given.builder,  }))

      it('throws a TypeError', () => {
        expect(() => given.add).toThrow(TypeError)
      })

      it('throws an error with explicit message', () => {
        expect(() => given.add).toThrow('Missing options: node, method')
      })
    })

    describe('with valid options', () => {
      it('does not throw any error', () => {
        expect(() => given.add).not.toThrow()
      })
    })
  })

  describe('handle', () => {
    it('adds an item to the container', () => {
      given.add.handle(clickEvent())
      expect(getItems(given.container).length).toEqual(1)
    })

    it('adds an item to the container every time', () => {
      given.add.handle(clickEvent())
      given.add.handle(clickEvent())
      expect(getItems(given.container).length).toEqual(2)
    })

    describe('a before-insert event', () => {
      it('is triggered', () => {
        const listener = jest.fn()
        given.container.addEventListener('cocooned:before-insert', listener)
        given.add.handle(clickEvent())

        expect(listener).toHaveBeenCalled()
      })

      itBehavesLikeAnEventListener({
        listen: (listener) => given.container.addEventListener('cocooned:before-insert', listener),
        dispatch: () => given.add.handle(clickEvent())
      })
    })

    describe('an after-insert event', () => {
      it('is triggered', () => {
        const listener = jest.fn()
        given.container.addEventListener('cocooned:after-insert', listener)
        given.add.handle(clickEvent())

        expect(listener).toHaveBeenCalled()
      })

      itBehavesLikeAnEventListener({
        listen: (listener) => given.container.addEventListener('cocooned:after-insert', listener),
        dispatch: () => given.add.handle(clickEvent())
      })
    })

    itBehavesLikeACancellableEvent({
      event: 'insert',
      dispatch: () => { given.add.handle(clickEvent()) }
    })

    describe('with builder', () => {
      afterEach(() => jest.restoreAllMocks())

      it('uses given builder to build new items', () => {
        const build = jest.spyOn(given.builder, 'build')
        given.add.handle(clickEvent())

        expect(build).toHaveBeenCalledTimes(1)
      })

      it('uses given builder to build each new item', () => {
        const build = jest.spyOn(given.builder, 'build')
        given.add.handle(clickEvent())
        given.add.handle(clickEvent())

        expect(build).toHaveBeenCalledTimes(2)
      })

      it('generates a new ID for each new item', () => {
        const build = jest.spyOn(given.builder, 'build')
        given.add.handle(clickEvent())
        given.add.handle(clickEvent())

        const ids = build.mock.calls.map(args => args[0])
        expect([...new Set(ids)]).toEqual(ids)
      })

      it('uses build DocumentFragment content as new item', () => {
        const p = document.createElement('p')

        jest.spyOn(given.builder, 'build').mockImplementation(_id => {
          const fragment = new DocumentFragment()
          fragment.append(p)

          return fragment
        })
        given.add.handle(clickEvent())

        expect(given.container.firstElementChild).toEqual(p)
      })
    })

    describe('with count', () => {
      beforeEach(() => given.add.handle(clickEvent()))

      given('options', () => ({
        builder: given.builder,
        count: faker.datatype.number({ min: 2, max: 5 }),
        node: given.addTrigger.parentElement,
        method: 'before'
      }))

      it('insert the correct count of items', () => {
        expect(getItems(given.container).length).toEqual(given.options.count)
      })
    })

    describe('with node and method', () => {
      beforeEach(() => given.add.handle(clickEvent()))

      given('node', () => given.container.querySelector('.node'))
      given('html', () => `
        <div class="cocooned-container">
          <div class="node"></div>
          <a class="cocooned-add" href="#">Add</a>
        </div>
        <template data-name="template">${given.template}</template>
      `)

      const methods = [
        {
          method: 'after',
          finder: (node) => node.nextElementSibling
        },
        {
          method: 'before',
          finder: (node) => node.previousElementSibling
        },
        {
          method: 'append',
          finder: (node) => node.lastElementChild
        },
        {
          method: 'prepend',
          finder: (node) => node.firstElementChild
        }
      ]

      describe.each(methods)('when method is $method', ({ method, finder }) => {
        given('options', () => ({ builder: given.builder, node: given.node, method: method }))

        it('insert new item at the right place', () => {
          expect(finder(given.node).classList).toContain('cocooned-item')
        })
      })

      describe('when method is replaceWith', () => {
        given('options', () => ({ builder: given.builder, node: given.node, method: 'replaceWith' }))

        it('replace the insertion point', () => {
          expect(given.container.querySelector('.node')).toBeNull()
        })

        it('inserts an item', () => {
          expect(given.container.firstElementChild.classList).toContain('cocooned-item')
        })
      })
    })
  })
})
