/* global given */

import { coreMixin } from '@notus.sh/cocooned/src/cocooned/plugins/core'
import { Base } from '@notus.sh/cocooned/src/cocooned/base'
import { Builder } from '@notus.sh/cocooned/src/cocooned/plugins/core/triggers/add/builder'
import { Replacement } from '@notus.sh/cocooned/src/cocooned/plugins/core/triggers/add/replacement'
import { faker } from '@cocooned/tests/support/faker'

describe('Builder', () => {
  given('extended', () => coreMixin(Base))
  given('builder', () => new Builder(given.template.content, given.replacements))
  given('association', () => 'new_person')
  given('id', () => faker.string.numeric(5))
  given('replacements', () => {
    return given.extended.replacements.map(r => {
      return new Replacement(r.attribute, 'new_person', ...r.delimiters)
    })
  })

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
    },
    {
      desc: 'nested',
      template: `
        <input type="text" id="contacts_new_person_name" name="contacts[new_person][name]">
        <template>
          <input type="text" id="contacts_new_person_new_attribute" name="contacts[new_person][new_attribute]">
        </template>
      `,
      expected: (id) => `
        <input type="text" id="contacts_${id}_name" name="contacts[${id}][name]">
        <template>
          <input type="text" id="contacts_${id}_new_attribute" name="contacts[${id}][new_attribute]">
        </template>
      `
    },
    {
      desc: 'Trix editor',
      template: `
        <input type="hidden" id="contacts_new_person_name_trix_input">
        <trix-editor id="contacts_new_person_name" input="contacts_new_person_name_trix_input"></trix-editor>
      `,
      expected: (id) => `
        <input type="hidden" id="contacts_${id}_name_trix_input">
        <trix-editor id="contacts_${id}_name" input="contacts_${id}_name_trix_input"></trix-editor>
      `
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
