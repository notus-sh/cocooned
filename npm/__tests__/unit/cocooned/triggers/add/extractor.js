/* global given */

import { Extractor } from '@notus.sh/cocooned/src/cocooned/triggers/add/extractor'
import { Builder } from '@notus.sh/cocooned/src/cocooned/builder'
import { deprecator } from '@notus.sh/cocooned/src/cocooned/deprecation'
import { jest } from '@jest/globals'
import { faker } from '@cocooned/tests/support/faker'
import { getAddLink } from '@cocooned/tests/support/selectors'

describe('Extractor', () => {
  beforeEach(() => document.body.innerHTML = given.html)

  given('extractor', () => new Extractor(given.addTrigger))
  given('addTrigger', () => getAddLink(document))
  given('html', () => `
    <a class="cocooned-add" href="#">Add</a>
  `)

  describe('extract', () => {
    given('options', () => given.extractor.extract())

    it('returns default options', () => {
      expect(given.options).toEqual(expect.objectContaining({method: 'before'}))
    })

    describe('with data-count', () => {
      given('count', () => faker.datatype.number({min: 2, max: 5}))
      given('html', () => `
        <a class="cocooned-add"
           data-count="${given.count}"
           href="#">Add</a>
      `)

      it('returns expected count option', () => {
        expect(given.options).toEqual(expect.objectContaining({count: given.count}))
      })
    })

    describe('with data-association-insertion-count', () => {
      given('count', () => faker.datatype.number({min: 2, max: 5}))
      given('html', () => `
        <a class="cocooned-add"
           data-association-insertion-count="${given.count}"
           href="#">Add</a>
      `)

      it('returns expected count option', () => {
        expect(given.options).toEqual(expect.objectContaining({count: given.count}))
      })
    })

    describe('with data-association and data-template', () => {
      given('template', () => `<p>Template content</p>`)
      given('html', () => `
        <a class="cocooned-add"
           data-association="item"
           data-template="template"
           href="#">Add</a>
        <template data-name="template">${given.template}</template>
      `)

      it('returns expected builder options', () => {
        expect(given.options).toEqual(expect.objectContaining({builder: expect.anything(),}))
      })

      it('returns a Builder instance', () => {
        expect(given.options).toEqual(expect.objectContaining({builder: expect.any(Builder),}))
      })

      it('returns a configured Builder instance', () => {
        const builder = given.options.builder
        expect(builder.build('').firstElementChild.outerHTML).toEqual(given.template)
      })
    })

    describe('with data-association-insertion-method', () => {
      given('method', () => 'any')
      given('html', () => `
        <a class="cocooned-add"
           data-association-insertion-method="${given.method}"
           href="#">Add</a>
      `)

      it('returns expected method options', () => {
        expect(given.options).toEqual(expect.objectContaining({method: given.method}))
      })
    })

    describe('with data-association-insertion-node', () => {
      given('node', () => document.querySelector('.node'))

      describe('when missing', () => {
        given('html', () => `
          <div class="node">
            <a class="cocooned-add" href="#">Add</a>
          </div>
        `)

        it("returns trigger's parent", () => {
          expect(given.options).toEqual(expect.objectContaining({ node: given.node }))
        })
      })

      describe('when "this"', () => {
        given('html', () => `
          <a class="cocooned-add"
             data-association-insertion-node="this"
             href="#">Add</a>
        `)

        it("returns expected node", () => {
          expect(given.options).toEqual(expect.objectContaining({ node: given.addTrigger }))
        })
      })

      describe('when expressed as a selector', () => {
        given('html', () => `
          <div class="node"></div>
          <a class="cocooned-add"
             data-association-insertion-node=".node"
             href="#">Add</a>
        `)

        it("returns expected node", () => {
          expect(given.options).toEqual(expect.objectContaining({ node: given.node }))
        })

        describe('with data-association-insertion-traversal', () => {
          afterEach(() => jest.restoreAllMocks())

          given('html', () => `
            <div class="node"></div>
            <a class="cocooned-add"
               data-association-insertion-node=".node"
               data-association-insertion-traversal="prev"
               href="#">Add</a>
          `)

          it('emits a deprecation warning', () => {
            const spy = jest.spyOn(deprecator('3.0'), 'warn')
            given.options

            expect(spy).toHaveBeenCalled()
          })

          it("returns expected node", () => {
            expect(given.options).toEqual(expect.objectContaining({ node: given.node }))
          })
        })
      })
    })
  })
})
