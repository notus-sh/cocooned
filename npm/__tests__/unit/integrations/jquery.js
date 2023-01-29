/* global given */

import { jQueryPluginMixin } from '@notus.sh/cocooned/src/integrations/jquery'
import { Base as Cocooned } from '@notus.sh/cocooned/src/cocooned/base'
import jQuery from 'jquery'
import { jest } from '@jest/globals'

describe('jQueryPluginMixin', () => {
  beforeEach(() => jQueryPluginMixin(jQuery, Cocooned))

  it('add a method to jQuery', () => {
    expect(jQuery.fn).toEqual(expect.objectContaining({ cocooned: expect.any(Function) }))
  })

  describe('jQuery.cocooned', () => {
    beforeEach(() => {
      document.body.innerHTML = given.html
      Cocooned.create = given.mock
    })
    afterEach(() => jest.restoreAllMocks())

    given('mock', () => jest.fn())
    given('html', () => `<section></section><section></section>`)

    it('create a Cocooned instance', () => {
      jQuery('section:first').cocooned()

      expect(given.mock).toHaveBeenCalled()
    })

    it('forwards options to the Cocooned instance', () => {
      const options = { limit: 12 }
      jQuery('section:first').cocooned(options)

      expect(given.mock).toHaveBeenCalledWith(document.querySelector('section'), options)
    })

    it('create a Cocooned instance for each member of the jQuery selection', () => {
      jQuery('section').cocooned()

      expect(given.mock).toHaveBeenCalledTimes(2)
    })
  })
})
