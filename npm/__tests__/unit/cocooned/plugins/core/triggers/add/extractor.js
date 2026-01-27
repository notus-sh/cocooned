/* global given */

import { coreMixin } from '@notus.sh/cocooned/src/cocooned/plugins/core'
import { Base } from '@notus.sh/cocooned/src/cocooned/base'
import { Extractor } from '@notus.sh/cocooned/src/cocooned/plugins/core/triggers/add/extractor'
import { Builder } from '@notus.sh/cocooned/src/cocooned/plugins/core/triggers/add/builder'
import { deprecator } from '@notus.sh/cocooned/src/cocooned/deprecation'
import { jest } from '@jest/globals'
import { faker } from '@cocooned/tests/support/faker'
import { getAddLink } from '@cocooned/tests/support/helpers'

describe('Extractor', () => {
  beforeEach(() => { document.body.innerHTML = given.html })

  given('extended', () => coreMixin(Base))
  // eslint-disable-next-line new-cap
  given('extractor', () => new Extractor(given.addTrigger, new given.extended(given.container)))
  given('container', () => document.querySelector('[data-cocooned-container]'))
  given('addTrigger', () => getAddLink(document))
  given('html', () => `
    <div data-cocooned-container></div>
    <a data-cocooned-trigger="add" href="#">Add</a>
  `)

  describe('extract', () => {
    given('options', () => given.extractor.extract())

    it('returns default options', () => {
      expect(given.extractor.extract()).toEqual(expect.objectContaining({ method: 'before' }))
    })

    describe('with data-count', () => {
      given('count', () => faker.number.int({ min: 2, max: 5 }))
      given('html', () => `
        <div data-cocooned-container></div>
        <a data-cocooned-trigger="add"
           data-count="${given.count}"
           href="#">Add</a>
      `)

      it('returns expected count option', () => {
        expect(given.extractor.extract()).toEqual(expect.objectContaining({ count: given.count }))
      })
    })

    describe('with data-association-insertion-count', () => {
      given('count', () => faker.number.int({ min: 2, max: 5 }))
      given('html', () => `
        <div data-cocooned-container></div>
        <a data-cocooned-trigger="add"
           data-association-insertion-count="${given.count}"
           href="#">Add</a>
      `)

      it('returns expected count option', () => {
        expect(given.extractor.extract()).toEqual(expect.objectContaining({ count: given.count }))
      })
    })

    describe('with data-association and data-template', () => {
      given('template', () => '<p>Template content</p>')
      given('html', () => `
        <div data-cocooned-container></div>
        <a data-cocooned-trigger="add"
           data-association="item"
           data-template="template"
           href="#">Add</a>
        <template data-name="template">${given.template}</template>
      `)

      it('returns expected builder options', () => {
        expect(given.extractor.extract()).toEqual(expect.objectContaining({ builder: expect.anything() }))
      })

      it('returns a Builder instance', () => {
        expect(given.extractor.extract()).toEqual(expect.objectContaining({ builder: expect.any(Builder) }))
      })

      it('returns a configured Builder instance', () => {
        const builder = given.extractor.extract().builder
        expect(builder.build('').firstElementChild.outerHTML).toEqual(given.template)
      })

      describe('when in a nested context', () => {
        given('addTrigger', () => getAddLink(given.container))
        given('html', () => `
          <div data-cocooned-container>
            <div data-cocooned-item>
              <a data-cocooned-trigger="add"
                 data-association="item"
                 data-template="template" href="#">Add</a>
              <template data-name="template">${given.template}</template>
            </div>
            <div data-cocooned-item>
              <a data-cocooned-trigger="add"
                 data-association="item"
                 data-template="template"
                 href="#">Add</a>
              <template data-name="template">Not me</template>
            </div>
          </div>
          <a data-cocooned-trigger="add" data-association="item" data-template="template" href="#">Add</a>
          <template data-name="template">Neither me</template>
        `)

        it('returns a Builder instance for the appropriate template', () => {
          const builder = given.extractor.extract().builder
          expect(builder.build('').firstElementChild.outerHTML).toEqual(given.template)
        })
      })
    })

    describe('with data-association-insertion-method', () => {
      given('method', () => 'any')
      given('html', () => `
        <div data-cocooned-container></div>
        <a data-cocooned-trigger="add"
           data-association-insertion-method="${given.method}"
           href="#">Add</a>
      `)

      it('returns expected method options', () => {
        expect(given.extractor.extract()).toEqual(expect.objectContaining({ method: given.method }))
      })
    })

    describe('with data-association-insertion-node', () => {
      given('node', () => document.querySelector('.node'))

      describe('when missing', () => {
        given('html', () => `
          <div data-cocooned-container></div>
          <div class="node">
            <a data-cocooned-trigger="add" href="#">Add</a>
          </div>
        `)

        it("returns trigger's parent", () => {
          expect(given.extractor.extract()).toEqual(expect.objectContaining({ node: given.node }))
        })
      })

      describe('when "this"', () => {
        given('html', () => `
          <div data-cocooned-container></div>
          <a data-cocooned-trigger="add"
             data-association-insertion-node="this"
             href="#">Add</a>
        `)

        it('returns expected node', () => {
          expect(given.extractor.extract()).toEqual(expect.objectContaining({ node: given.addTrigger }))
        })
      })

      describe('when expressed as a selector', () => {
        given('html', () => `
          <div data-cocooned-container></div>
          <div class="node"></div>
          <a data-cocooned-trigger="add"
             data-association-insertion-node=".node"
             href="#">Add</a>
        `)

        it('returns expected node', () => {
          expect(given.extractor.extract()).toEqual(expect.objectContaining({ node: given.node }))
        })

        describe('with data-association-insertion-traversal', () => {
          beforeEach(() => { given.deprecator.logger = { warn: jest.fn() } })
          afterEach(() => jest.restoreAllMocks())

          given('deprecator', () => deprecator('4.0'))
          given('html', () => `
            <div data-cocooned-container></div>
            <div class="node"></div>
            <a data-cocooned-trigger="add"
               data-association-insertion-node=".node"
               data-association-insertion-traversal="prev"
               href="#">Add</a>
          `)

          it('emits a deprecation warning', () => {
            const spy = jest.spyOn(given.deprecator, 'warn')
            given.extractor.extract()

            expect(spy).toHaveBeenCalled()
          })

          it('returns expected node', () => {
            expect(given.options).toEqual(expect.objectContaining({ node: given.node }))
          })
        })
      })
    })
  })
})
