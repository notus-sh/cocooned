const Cocooned = require('../../../app/assets/javascripts/cocooned');
const { asAttribute } = require('../../support/helpers');

describe('A Cocooned setup', () => {
  given('insertionTemplate', () => `<div class="cocooned-item"></div>`);
  given('container', () => document.querySelector('section'));
  given('link', () => document.querySelector('.cocooned-add'));
  given('event', () => new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  given('item', () => given.container.querySelector('.cocooned-item'));

  given('prepare', () => null);

  beforeEach(() => {
    document.body.innerHTML = given.template;
    if (typeof given.prepare === 'function') given.prepare();
    new Cocooned(given.container);

    given.link.dispatchEvent(given.event)
  });

  describe('without association-insertion-node', () => {
    given('template', () => `
      <section>
        <div>
          <a class="cocooned-add" href="#"
             data-associations="items"
             data-association-insertion-template="${asAttribute(given.insertionTemplate)}">Add</a>
        </div>
      </section>
    `);
    given('insertionNode', () => given.link.parentElement);

    it('insert new items before link parent', () => {
      expect(given.insertionNode.previousElementSibling).toBe(given.item);
    });
  });

  describe('with association-insertion-node as "this"', () => {
    given('template', () => `
      <section>
        <a class="cocooned-add" href="#"
           data-associations="items"
           data-association-insertion-node="this"
           data-association-insertion-template="${asAttribute(given.insertionTemplate)}">Add</a>
      </section>
    `);
    given('insertionNode', () => given.link);

    it('insert new items before the link', () => {
      expect(given.insertionNode.previousElementSibling).toBe(given.item);
    });
  });

  // As HTML dataset are DOMStringMap, it seems they only accept… well… strings as values.
  // Couldn't find another way to use this than through jQuery.data implementation.
  // As this seems a rather limited use case, we surely can drop it in the future.
  describe('with association-insertion-node as a function', () => {
    given('template', () => `
      <section>
        <div class="closest">
          <a class="cocooned-add" href="#"
             data-associations="items"
             data-association-insertion-template="${asAttribute(given.insertionTemplate)}">Add</a>
        </div>
      </section>
    `);
    given('prepare', () => {
      return () => {
        $(given.link).data('association-insertion-node', (adder) => adder.closest('.closest'));
      };
    });
    given('insertionNode', () => given.container.querySelector('.closest'));

    it('insert new items before the link', () => {
      expect(given.insertionNode.previousElementSibling).toBe(given.item);
    });
  });

  describe('with association-insertion-node as a selector', () => {
    given('template', () => `
      <section>
        <div class="insertion-node"></div>
        
        <a class="cocooned-add" href="#"
           data-associations="items"
           data-association-insertion-node=".insertion-node"
           data-association-insertion-template="${asAttribute(given.insertionTemplate)}">Add</a>
      </section>
    `);
    given('insertionNode', () => given.container.querySelector('.insertion-node'));

    it('insert new items before the expected element', () => {
      expect(given.insertionNode.previousElementSibling).toBe(given.item);
    });

    describe('with association-insertion-traversal as a jQuery traversal method name', () => {
      // See https://api.jquery.com/category/traversing/tree-traversal/
      // Methods other than those listed here does not really make sense as a viable traversal method.
      const traversals = [
        {
          traversal: 'closest',
          finder: (link) => link.closest('.closest'),
          template: (adder) => `<div class="closest"><div>${adder}</div></div>`
        },
        {
          traversal: 'next',
          finder: (link) => link.parentElement.querySelector('.next'),
          template: (adder) => `${adder}<div class="next"></div>`
        },
        {
          traversal: 'parent',
          finder: (link) => link.parentElement,
          template: (adder) => `<div class="parent">${adder}</div>`
        },
        {
          traversal: 'prev',
          finder: (link) => link.previousElementSibling,
          template: (adder) => `<div class="prev"></div>${adder}`
        },
        {
          traversal: 'siblings',
          finder: (link) => link.parentElement.querySelector('.siblings'),
          template: (adder) => `${adder}<div class="siblings"></div>`
        }
      ];

      describe.each(traversals)('when $traversal', ({ traversal, finder, template }) => {
        given('adder', () => `
          <a class="cocooned-add" href="#"
             data-associations="items"
             data-association-insertion-node=".${given.insertionTraversal}"
             data-association-insertion-traversal="${given.insertionTraversal}"
             data-association-insertion-template="${asAttribute(given.insertionTemplate)}">Add</a>
        `);
        given('insertionTraversal', () => traversal);
        given('template', () => `<section>${template(given.adder)}</section>`);

        it('insert new items before the expected element', () => {
          expect(finder(given.link).previousElementSibling).toBe(given.item);
        });
      });
    });
  });
});
