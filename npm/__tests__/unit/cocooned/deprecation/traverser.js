/* global given */

import { Traverser } from '@notus.sh/cocooned/src/cocooned/deprecation/traverser'

describe('Traverser', () => {
  describe('extract', () => {
    beforeEach(() => document.body.innerHTML = given.html)

    given('traverser', () => new Traverser(given.origin, given.traversal))
    given('origin', () => document.querySelector('.origin'))

    const resolvable = [
      {
        traversal: 'closest',
        html: `<div class="resolved"><div><div class="origin"></div></div></div>`
      },
      {
        traversal: 'parentElement',
        html: `<div class="resolved"><div class="origin"></div></div>`
      },
      {
        traversal: 'previousElementSibling',
        html: `<div class="resolved"></div><div class="origin"></div>`
      },
      {
        traversal: 'nextElementSibling',
        html: `<div class="origin"></div><div class="resolved"></div>`
      },
      {
        traversal: 'parent',
        html: `<div class="resolved"><div class="origin"></div></div>`
      },
      {
        traversal: 'prev',
        html: `<div class="resolved"></div><div class="origin"></div>`
      },
      {
        traversal: 'next',
        html: `<div class="origin"></div><div class="resolved"></div>`
      },
      {
        traversal: 'siblings',
        html: `<div><div class="origin"></div><div></div><div class="resolved"></div></div>`
      },
    ]

    describe.each(resolvable)('with resolvable traversal as $traversal', ({ traversal, html }) => {
      given('traversal', () => traversal)
      given('html', () => html)

      it('returns expected node', () => {
        expect(given.traverser.resolve('.resolved')).toBe(document.querySelector('.resolved'))
      })
    })

    const unresolvable = [
      {
        traversal: 'closest',
        html: `<div><div class="origin"></div></div>`
      },
      {
        traversal: 'parent',
        html: `<div><div class="origin"></div></div>`
      },
      {
        traversal: 'prev',
        html: `<div></div><div class="origin"></div>`
      },
      {
        traversal: 'next',
        html: `<div class="origin"></div><div></div>`
      },
      {
        traversal: 'siblings',
        html: `<div><div class="origin"></div><div></div></div>`
      },
    ]

    describe.each(unresolvable)('with unresolvable traversal as $traversal', ({ traversal, html }) => {
      given('traversal', () => traversal)
      given('html', () => html)

      it('returns null', () => {
        expect(given.traverser.resolve('.resolved')).toBeNull()
      })
    })
  })
})
