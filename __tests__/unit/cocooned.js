const Cocooned = require('../../app/assets/javascripts/cocooned');
const { asAttribute } = require('../support/helpers');

describe('A basic Cocooned setup', () => {
  given('template', () => `
    <section>
      ${given.insertionTemplate}
      <div>
        <a class="cocooned-add" href="#"
           data-association-insertion-template="${asAttribute(given.insertionTemplate)}">Add</a>
      </div>
    </section>
  `);
  given('insertionTemplate', () => `<div class="cocooned-item"></div>`);

  beforeEach(() => {
    document.body.innerHTML = given.template;
  });

  describe('once instanced', () => {
    given('container', () => document.querySelector('section'));
    given('cocooned', () => new Cocooned(given.container));

    beforeEach(() => given.cocooned);

    it('does not change container content', () => {
      expect(document.querySelectorAll('.cocooned-item').length).toEqual(1);
    });

    it('associates itself with container', () => {
      expect(given.container.dataset).toHaveProperty('cocooned');
    });

    it('add an ID to container', () => {
      expect(given.container).toHaveAttribute('id');
    });

    it('add a class to container', () => {
      expect(given.container).toHaveClass('cocooned-container');
    });

    describe('when add link is clicked', () => {
      given('link', () => document.querySelector('.cocooned-add'));
      given('event', () => new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

      it('adds an item to the container', () => {
        given.link.dispatchEvent(given.event);
        expect(given.container.querySelectorAll('.cocooned-item').length).toEqual(2);
      });

      it('adds an item to the container every time it is clicked', () => {
        given.link.dispatchEvent(given.event);
        given.link.dispatchEvent(given.event);
        expect(given.container.querySelectorAll('.cocooned-item').length).toEqual(3);
      });
    });

    describe('with items including a remove link', () => {
      given('insertionTemplate', () => `
        <div class="cocooned-item">
          <a class="cocooned-remove dynamic" href="#">Remove</a>
        </div>
      `);

      describe('when remove link is clicked', () => {
        given('link', () => document.querySelector('.cocooned-remove'));
        given('event', () => new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

        it('removes an item from the container', () => {
          given.link.dispatchEvent(given.event);
          expect(given.container.querySelectorAll('.cocooned-item').length).toEqual(0);
        });
      });
    });
  });
});
