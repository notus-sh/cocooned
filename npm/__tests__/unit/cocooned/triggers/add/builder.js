/* global given */

import { Builder } from '@notus.sh/cocooned/src/cocooned/triggers/add/builder'
import { faker } from '@cocooned/tests/support/faker'

describe('Builder', () => {
  given('builder', () => new Builder(given.template.content, given.association))
  given('association', () => 'new_person')
  given('id', () => faker.random.numeric(5))

  const replacements = [
    {
      desc: 'braced singular',
      template: '<input type="text" name="contacts[new_person][name]">',
      expected: (id) => `<input type="text" name="contacts[${id}][name]">`
    },
    {
      desc: 'underscored singular',
      template: '<input type="text" id="contacts_new_person_name">',
      expected: (id) => `<input type="text" id="contacts_${id}_name">`
    },
    {
      desc: 'both singular',
      template: '<input type="text" id="contacts_new_person_name" name="contacts[new_person][name]">',
      expected: (id) => `<input type="text" id="contacts_${id}_name" name="contacts[${id}][name]">`
    }
  ]

  describe.each(replacements)('with $desc occurrences', ({ desc, template, expected }) => {
    beforeEach(() => { document.body.innerHTML = `<template>${template}</template>` })

    given('template', () => document.querySelector('template'))

    it('replace occurences', () => {
      const built = given.builder.build(given.id)
      const div = document.createElement('div')
      div.appendChild(built)

      expect(div.innerHTML).toEqual(expected(given.id))
    })
  })
})
