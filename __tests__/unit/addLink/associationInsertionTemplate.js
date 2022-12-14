/* global given */

const Cocooned = require('@cocooned/src/javascripts/cocooned')
const { setup, asAttribute, clickEvent } = require('@cocooned/tests/support/helpers')
const { getItem, getAddLink } = require('@cocooned/tests/support/selectors')

describe('A Cocooned setup', () => {
  given('template', () => `
    <section>
      <div>
        <a class="cocooned-add" href="#"
           data-associations="items"
           data-association-insertion-template="${asAttribute(given.insertionTemplate)}">Add</a>
      </div>
    </section>
  `)
  given('container', () => document.querySelector('section'))
  given('cocooned', () => new Cocooned(given.container))
  given('addLink', () => getAddLink(given.container))
  given('item', () => getItem(given.container))

  beforeEach(() => {
    setup(document, given)

    given.addLink.dispatchEvent(clickEvent())
  })

  describe('with a simple insertion template', () => {
    given('insertionTemplate', () => `
      <div class="cocooned-item"></div>
    `)

    it('insert new item with correct markup', () => {
      expect(given.item.outerHTML).toEqual(given.insertionTemplate.trim())
    })
  })

  describe('with an insertion template containing form fields', () => {
    given('insertionTemplate', () => `
      <div class="cocooned-item">
        <input type="hidden" name="list[items_attributes][new_items][_destroy]" />
        
        <label for="list_items_attributes_new_items_label">Label</label>
        <input type="text"
               name="list[items_attributes][new_items][label]"
               id="list_items_attributes_new_items_label" />
      </div>
    `)

    describe('with underscored attributes', () => {
      const attributes = [
        { selector: 'label', attribute: 'for' },
        { selector: 'input[type=text]', attribute: 'id' }
      ]

      it.each(attributes)('replaces association name', ({ selector, attribute }) => {
        const value = given.item.querySelector(selector).getAttribute(attribute)

        expect(value).not.toMatch(/_new_items_/)
      })

      it.each(attributes)('injects uniq identifier', ({ selector, attribute }) => {
        const value = given.item.querySelector(selector).getAttribute(attribute)

        expect(value).toMatch(/^list_items_attributes_[0-9]+_label$/)
      })

      it('uses the same uniq identifier', () => {
        const values = attributes.map(({ selector, attribute }) => {
          return given.item.querySelector(selector).getAttribute(attribute)
        })
        const uniqIds = values.map(value => {
          return value.match(/^list_items_attributes_(?<id>[0-9]+)_label$/).groups.id
        })

        expect([...new Set(uniqIds)]).toEqual([uniqIds[0]])
      })
    })

    describe('with braced attributes', () => {
      const attributes = [
        { selector: 'input[type=text]', attribute: 'name' },
        { selector: 'input[type=hidden]', attribute: 'name' }
      ]

      it.each(attributes)('replaces association name', ({ selector, attribute }) => {
        const value = given.item.querySelector(selector).getAttribute(attribute)

        expect(value).not.toMatch(/\[new_items]/)
      })

      it.each(attributes)('injects uniq identifier', ({ selector, attribute }) => {
        const value = given.item.querySelector(selector).getAttribute(attribute)

        expect(value).toMatch(/^list\[items_attributes]\[[0-9]+]\[[a-z_-]+]$/)
      })

      it('uses the same uniq identifier', () => {
        const values = attributes.map(({ selector, attribute }) => {
          return given.item.querySelector(selector).getAttribute(attribute)
        })
        const uniqIds = values.map(value => {
          return value.match(/^list\[items_attributes]\[(?<id>[0-9]+)]\[[a-z_-]+]$/).groups.id
        })

        expect([...new Set(uniqIds)]).toEqual([uniqIds[0]])
      })
    })
  })
})
