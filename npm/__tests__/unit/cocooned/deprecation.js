/* global given */

import { deprecator } from '@notus.sh/cocooned/src/cocooned/deprecation'
import { jest } from '@jest/globals'
import { faker } from '@cocooned/tests/support/faker'

describe('deprecator', () => {
  it('returns a configured Deprecator', () => {
    const built = deprecator('3.0')

    expect(built.version).toEqual('3.0')
    expect(built.package).toEqual('Cocooned')
    expect(built.logger).toBe(console)
  })

  it('returns always the same Deprecator for the same package name and version', () => {
    expect(deprecator('3.0')).toBe(deprecator('3.0'))
  })

  it('returns different Deprecators for different package name or version', () => {
    expect(deprecator('3.0')).not.toBe(deprecator('3.0', 'Package'))
  })
})

describe('Deprecator', () => {
  afterEach(() => jest.restoreAllMocks())

  given('deprecator', () => deprecator(given.version, given.package, given.logger))
  given('version', () => faker.system.semver())
  given('package', () => faker.word.noun())
  given('logger', () => ({ warn: given.warn }))
  given('warn', () => jest.fn())
  given('emitted', () => given.warn.mock.calls[0][0])

  describe('warn', () => {
    it('outputs a deprecation warning to logger', () => {
      given.deprecator.warn('A feature is deprecated')
      expect(given.warn).toHaveBeenCalled()
    })

    it('outputs a unique deprecation warning to console', () => {
      given.deprecator.warn('A feature is deprecated')
      given.deprecator.warn('A feature is deprecated')

      expect(given.warn).toHaveBeenCalledTimes(1)
    })

    it('prefixes deprecation warning', () => {
      given.deprecator.warn('A feature is deprecated')
      expect(given.emitted).toMatch(/^DEPRECATION WARNING: /)
    })

    it('specifies deprecation horizon', () => {
      given.deprecator.warn('A feature is deprecated')
      expect(given.emitted).toMatch(new RegExp(`It will be removed from ${given.package} ${given.version}.$`))
    })

    it('supports optional alternative', () => {
      given.deprecator.warn('A feature is deprecated', 'another feature')
      expect(given.emitted).toMatch(/, use another feature instead\./)
    })
  })
})
