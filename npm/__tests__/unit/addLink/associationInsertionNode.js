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

  given('prepare', () => null)

  beforeEach(() => {
    setup(document, given)

    given.addLink.dispatchEvent(clickEvent())
  })

  describe('without association-insertion-node', () => {
    given('template', () => `
      <section>
        <div>
          <a class="cocooned-add" href="#"
             data-association="items"
             data-template="template">Add</a>
          <template data-name="template">${given.insertionTemplate}</template>
        </div>
      </section>
    `)
    given('insertionNode', () => given.addLink.parentElement)

    it('insert new items before link parent', () => {
      expect(given.insertionNode.previousElementSibling).toBe(given.item)
    })
  })

  describe('with association-insertion-node as "this"', () => {
    given('template', () => `
      <section>
        <a class="cocooned-add" href="#"
           data-association="items"
           data-template="template"
           data-association-insertion-node="this">Add</a>
        <template data-name="template">${given.insertionTemplate}</template>
      </section>
    `)
    given('insertionNode', () => given.addLink)

    it('insert new items before the link', () => {
      expect(given.insertionNode.previousElementSibling).toBe(given.item)
    })
  })

  // As HTML dataset are DOMStringMap, it seems they only accept… well… strings as values.
  // Couldn't find another way to use this than through jQuery.data implementation.
  // As this seems a rather limited use case, we surely can drop it in the future.
  describe('with association-insertion-node as a function', () => {
    given('template', () => `
      <section>
        <div class="closest">
          <a class="cocooned-add" href="#"
             data-association="items"
             data-template="template">Add</a>
          <template data-name="template">${given.insertionTemplate}</template>
        </div>
      </section>
    `)
    given('prepare', () => {
      return () => {
        $(given.addLink).data('association-insertion-node', (adder) => adder.closest('.closest'))
      }
    })
    given('insertionNode', () => given.container.querySelector('.closest'))

    it('insert new items before the link', () => {
      expect(given.insertionNode.previousElementSibling).toBe(given.item)
    })
  })

  describe('with association-insertion-node as a selector', () => {
    given('template', () => `
      <section>
        <div class="insertion-node"></div>
        
        <a class="cocooned-add" href="#"
           data-association="items"
           data-template="template"
           data-association-insertion-node=".insertion-node">Add</a>
        <template data-name="template">${given.insertionTemplate}</template>
      </section>
    `)
    given('insertionNode', () => given.container.querySelector('.insertion-node'))

    it('insert new items before the expected element', () => {
      expect(given.insertionNode.previousElementSibling).toBe(given.item)
    })

    describe('with association-insertion-traversal as a jQuery traversal method name', () => {
      // See https://api.jquery.com/category/traversing/tree-traversal/
      // Methods other than those listed here does not really make sense as a viable traversal method.
      const traversals = [
        {
          traversal: 'closest',
          finder: (link) => link.closest('.closest'),
          template: (adder) => `<div class="closest"><div>${adder}</div></div>`
        },
        {
          traversal: 'next',
          finder: (link) => link.parentElement.querySelector('.next'),
          template: (adder) => `${adder}<div class="next"></div>`
        },
        {
          traversal: 'parent',
          finder: (link) => link.parentElement,
          template: (adder) => `<div class="parent">${adder}</div>`
        },
        {
          traversal: 'prev',
          finder: (link) => link.previousElementSibling,
          template: (adder) => `<div class="prev"></div>${adder}`
        },
        {
          traversal: 'siblings',
          finder: (link) => link.parentElement.querySelector('.siblings'),
          template: (adder) => `${adder}<div class="siblings"></div>`
        }
      ]

      describe.each(traversals)('when $traversal', ({ traversal, finder, template }) => {
        given('adder', () => `
          <a class="cocooned-add" href="#"
             data-association="items"
             data-template="template"
             data-association-insertion-node=".${given.insertionTraversal}"
             data-association-insertion-traversal="${given.insertionTraversal}">Add</a>
        `)
        given('insertionTraversal', () => traversal)
        given('template', () => `
          <section>
            ${template(given.adder)}
            <template data-name="template">${given.insertionTemplate}</template>
          </section>`)

        it('insert new items before the expected element', () => {
          expect(finder(given.addLink).previousElementSibling).toBe(given.item)
        })
      })
    })
  })
})
