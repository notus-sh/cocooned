const $ = require('jquery');
const Cocooned = require('../../app/assets/javascripts/cocooned');

describe('A basic cocooned setup', () => {
  given('template', () => `
    <section>
      <div class="cocooned-item"></div>
      
      <div>
        <a class="cocooned-add" href="#"
           data-association-insertion-template="&lt;div class=&quot;cocooned-item&quot;&gt;&lt;/div&gt;">Add</a>
      </div>
    </section>
  `);

  beforeEach(() => {
    document.body.innerHTML = given.template;
  });

  describe('once instanced', () => {
    given('container', () => document.querySelector('section'));

    beforeEach(() => {
      new Cocooned(given.container);
    });

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
      beforeEach(() => {
        const event = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });

        document.querySelector('.cocooned-add').dispatchEvent(event);
      });

      it('adds an item to the container', () => {
        expect(given.container.querySelectorAll('.cocooned-item').length).toEqual(2);
      });
    });
  });
});
