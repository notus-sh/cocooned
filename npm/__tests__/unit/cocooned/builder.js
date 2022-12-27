/* global given */

import Builder from '@notus.sh/cocooned/src/cocooned/builder'
import { faker } from '@cocooned/tests/support/faker'

describe('Builder', () => {
  given('builder', () => new Builder(given.template, given.singular, given.plural))
  given('singular', () => 'person')
  given('plural', () => 'people')
  given('id', () => faker.random.numeric(5))

  const replacements = [
    {
      desc: 'braced singular',
      template: '<input type="text" name="contacts[person][name]" />',
      expected: (id) => `<input type="text" name="contacts[${id}][name]" />`
    },
    {
      desc: 'underscored singular',
      template: '<input type="text" id="contacts_person_name" />',
      expected: (id) => `<input type="text" id="contacts_${id}_name" />`
    },
    {
      desc: 'both singular',
      template: '<input type="text" id="contacts_person_name" name="contacts[person][name]" />',
      expected: (id) => `<input type="text" id="contacts_${id}_name" name="contacts[${id}][name]" />`
    },
    {
      desc: 'braced plural',
      template: '<input type="text" name="contacts[people][name]" />',
      expected: (id) => `<input type="text" name="contacts[${id}][name]" />`
    },
    {
      desc: 'underscored plural',
      template: '<input type="text" id="contacts_people_name" />',
      expected: (id) => `<input type="text" id="contacts_${id}_name" />`
    },
    {
      desc: 'both plural',
      template: '<input type="text" id="contacts_people_name" name="contacts[people][name]" />',
      expected: (id) => `<input type="text" id="contacts_${id}_name" name="contacts[${id}][name]" />`
    },
    {
      desc: 'singular and plural',
      template: '<input type="text" id="contacts_people_name" name="contacts[person][name]" />',
      expected: (id) => `<input type="text" id="contacts_${id}_name" name="contacts[${id}][name]" />`
    }
  ]

  describe.each(replacements)('with $desc occurrences', ({ desc, template, expected }) => {
    given('template', () => template)

    it('replace occurences', () => {
      expect(given.builder.build(given.id)).toEqual(expected(given.id))
    })
  })
})
