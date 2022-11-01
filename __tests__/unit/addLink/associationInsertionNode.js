const Cocooned = require('../../../app/assets/javascripts/cocooned');
const { asAttribute } = require('../../support/helpers');

describe('A Cocooned setup', () => {
  given('insertionTemplate', () => `<div class="cocooned-item"></div>`);
  given('container', () => document.querySelector('section'));
  given('link', () => document.querySelector('.cocooned-add'));
  given('event', () => new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  given('item', () => given.container.querySelector('.cocooned-item'));

  beforeEach(() => {
    document.body.innerHTML = given.template;
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
        { traversal: 'closest',   finder: (link) => link.closest('.closest') },
        // Somehow broken :/
        // Can't use nextElementSibling here as, at the time of finding, it is no more the next one.
        // { traversal: 'next',      finder: (link) => link.parentElement.querySelector(':scope > .next') },
        { traversal: 'parent',    finder: (link) => link.parentElement },
        { traversal: 'prev',      finder: (link) => link.previousElementSibling },
        { traversal: 'siblings',  finder: (link) => link.parentElement.querySelector(':scope > .siblings') },
      ];

      given('template', () => `
        <section>
          <div class="closest">
            <div class="parent">
              <div class="prev siblings"></div>
              <a class="cocooned-add" href="#"
                 data-associations="items"
                 data-association-insertion-node=".${given.insertionTraversal}"
                 data-association-insertion-traversal="${given.insertionTraversal}"
                 data-association-insertion-template="${asAttribute(given.insertionTemplate)}">Add</a>
              <div class="next"></div> 
            </div>
          </div>
        </section>
      `);

      describe.each(traversals)('when $traversal', ({ traversal, finder }) => {
        given('insertionTraversal', () => traversal);

        it('insert new items before the expected element', () => {
          expect(finder(given.link).previousElementSibling).toBe(given.item);
        });
      });
    });
  });
});
