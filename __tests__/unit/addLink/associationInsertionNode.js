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

    it('insert new items at the expected place', () => {
      expect(given.insertionNode.previousSibling).toBe(given.item);
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

    it('insert new items at the expected place', () => {
      expect(given.insertionNode.previousSibling).toBe(given.item);
    });
  });
});
