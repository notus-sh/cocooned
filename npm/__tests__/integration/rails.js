/* global given */

import Cocooned from '@notus.sh/cocooned'
import { jest } from '@jest/globals'
import { faker } from '@cocooned/tests/support/faker'
import { clickEvent, getAddLink, getRemoveLink, getMoveUpLink, getMoveDownLink } from '@cocooned/tests/support/helpers'

// TODO: When officially supported, replace with:
// import fixtures from '@cocooned/tests/fixtures/rails.json' assert { type: 'json' }
import { readFile } from 'fs/promises'
const fixtures = JSON.parse(await readFile(new URL('./../fixtures/rails.json', import.meta.url)))

describe('A Rails generated Cocooned setup', () => {
  beforeEach(() => {
    document.body.innerHTML = given.html
    given.cocooned.start()
  })

  given('container', () => document.querySelector('[data-cocooned-container]'))
  given('cocooned', () => new Cocooned(given.container))
  given('addLink', () => getAddLink(given.container))

  const itBehavesLikeACocoonedSetup = () => {
    describe('when add link is clicked', () => {
      it('fires a before-insert event', () => {
        const listener = jest.fn()
        given.container.addEventListener('cocooned:before-insert', listener)
        given.addLink.dispatchEvent(clickEvent())

        expect(listener).toHaveBeenCalled()
      })
    })

    describe('with an item', () => {
      beforeEach(() => given.addLink.dispatchEvent(clickEvent()))

      describe('when remove link is clicked', () => {
        given('removeLink', () => getRemoveLink(given.container))

        it('fires a before-remove event', () => {
          const listener = jest.fn()
          given.container.addEventListener('cocooned:before-remove', listener)
          given.removeLink.dispatchEvent(clickEvent())

          expect(listener).toHaveBeenCalled()
        })
      })
    })

    describe('with more than one item', () => {
      beforeEach(() => {
        for (let i = 0; i < given.count; i++) {
          given.addLink.dispatchEvent(clickEvent())
        }
      })

      given('count', () => faker.datatype.number({ min: 3, max: 5 }))
      given('index', () => faker.datatype.number({ min: 1, max: given.count - 2 }))

      describe('when move up link is clicked', () => {
        given('moveLink', () => getMoveUpLink(given.container, given.index))

        it('fires a before-move event', () => {
          const listener = jest.fn()
          given.container.addEventListener('cocooned:before-move', listener)
          given.moveLink.dispatchEvent(clickEvent())

          expect(listener).toHaveBeenCalled()
        })
      })

      describe('when move down link is clicked', () => {
        given('moveLink', () => getMoveDownLink(given.container, given.index))

        it('fires a before-move event', () => {
          const listener = jest.fn()
          given.container.addEventListener('cocooned:before-move', listener)
          given.moveLink.dispatchEvent(clickEvent())

          expect(listener).toHaveBeenCalled()
        })
      })
    })
  }

  describe('with links', () => {
    given('html', () => fixtures.link)

    itBehavesLikeACocoonedSetup()
  })

  describe('with buttons', () => {
    given('html', () => fixtures.button)

    itBehavesLikeACocoonedSetup()
  })
})
