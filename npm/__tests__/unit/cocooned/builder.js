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
      i: '<input type="text" name="contacts[person][name]" />',
      o: (id) => `<input type="text" name="contacts[${id}][name]" />`
    },
    {
      desc: 'underscored singular',
      i: '<input type="text" id="contacts_person_name" />',
      o: (id) => `<input type="text" id="contacts_${id}_name" />`
    },
    {
      desc: 'both singular',
      i: '<input type="text" id="contacts_person_name" name="contacts[person][name]" />',
      o: (id) => `<input type="text" id="contacts_${id}_name" name="contacts[${id}][name]" />`
    },
    {
      desc: 'braced plural',
      i: '<input type="text" name="contacts[people][name]" />',
      o: (id) => `<input type="text" name="contacts[${id}][name]" />`
    },
    {
      desc: 'underscored plural',
      i: '<input type="text" id="contacts_people_name" />',
      o: (id) => `<input type="text" id="contacts_${id}_name" />`
    },
    {
      desc: 'both plural',
      i: '<input type="text" id="contacts_people_name" name="contacts[people][name]" />',
      o: (id) => `<input type="text" id="contacts_${id}_name" name="contacts[${id}][name]" />`
    },
    {
      desc: 'singular and plural',
      i: '<input type="text" id="contacts_people_name" name="contacts[person][name]" />',
      o: (id) => `<input type="text" id="contacts_${id}_name" name="contacts[${id}][name]" />`
    }
  ]

  describe.each(replacements)('with $desc occurrences', ({ desc, i, o }) => {
    given('template', () => i)

    it('replace occurences', () => {
      expect(given.builder.build(given.id)).toEqual(o(given.id))
    })
  })
})
