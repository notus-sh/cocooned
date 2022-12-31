/* global given */

import Cocooned from '@notus.sh/cocooned/cocooned'
import { setup, asAttribute, clickEvent } from '@cocooned/tests/support/helpers'
import { getItem, getAddLink } from '@cocooned/tests/support/selectors'

describe('A Cocooned setup', () => {
  given('insertionTemplate', () => '<div class="cocooned-item"></div>')
  given('container', () => document.querySelector('section'))
  given('cocooned', () => new Cocooned(given.container))
  given('addLink', () => getAddLink(given.container))
  given('item', () => getItem(given.container))

  beforeEach(() => {
    setup(document, given)

    given.addLink.dispatchEvent(clickEvent())
  })

  describe('without association-insertion-method', () => {
    given('template', () => `
      <section>
        <div>
          <a class="cocooned-add" href="#"
             data-association="items"
             data-template-id="template">Add</a>
          <template id="template">${given.insertionTemplate}</template>
        </div>
      </section>
    `)

    it('insert new item before the insertion point', () => {
      expect(given.addLink.parentElement.previousElementSibling).toEqual(given.item)
    })
  })

  describe('with association-insertion-method as a jQuery insertion method', () => {
    // See:
    // - https://api.jquery.com/category/manipulation/dom-insertion-outside/
    // - https://api.jquery.com/category/manipulation/dom-insertion-inside/
    // - https://api.jquery.com/category/manipulation/dom-replacement/
    //
    // Methods other than those listed here can not be used as insertion method
    // (and replaceWith is a very special use case).
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
        finder: (node) => node.lastChild
      },
      {
        method: 'prepend',
        finder: (node) => node.firstChild
      }
    ]

    given('template', () => `
      <section>
        <a class="cocooned-add" href="#"
           data-association="items"
           data-template-id="template"
           data-association-insertion-method="${given.insertionMethod}">Add</a>
        <template id="template">${given.insertionTemplate}</template>
      </section>
    `)

    describe.each(methods)('when $method', ({ method, finder }) => {
      given('insertionMethod', () => method)

      it('insert new item at the right place', () => {
        expect(finder(given.container)).toBe(given.item)
      })
    })

    describe('when replaceWith', () => {
      given('template', () => `
        <section>
          <div class="insertion-node"></div>
          
          <a class="cocooned-add" href="#"
             data-association="items"
             data-template-id="template"
             data-association-insertion-node=".insertion-node"
             data-association-insertion-method="${given.insertionMethod}">Add</a>
          <template id="template">${given.insertionTemplate}</template>
        </section>
      `)
      given('insertionMethod', () => 'replaceWith')

      it('replace the insertion point', () => {
        expect(given.container.querySelector('.insertion-node')).toBeNull()
      })

      it('inserts an item', () => {
        expect(given.item).not.toBeNull()
      })
    })
  })
})
