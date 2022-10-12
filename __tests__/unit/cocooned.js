const $ = require('jquery');
const Cocooned = require('../../app/assets/javascripts/cocooned');

describe('A basic cocooned setup', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section>
        <div class="cocooned-item"></div>
        
        <div>
          <a class="cocooned-add" href="#"
             data-association-insertion-template="&lt;div class=&quot;cocooned-item&quot;&gt;&lt;/div&gt;">Add</a>
        </div>
      </section>
    `;
  });

  describe('once instanced', () => {
    let container;
    let cocooned;

    beforeEach(() => {
      container = document.querySelector('section');
      cocooned = new Cocooned(container);
    });

    it('does not change container content', () => {
      expect(document.querySelectorAll('.cocooned-item').length).toEqual(1);
    });

    it('associates itself with container', () => {
      expect(container.dataset).toHaveProperty('cocooned');
    });

    it('add an ID to container', () => {
      expect(container).toHaveAttribute('id');
    });

    it('add a class to container', () => {
      expect(container).toHaveClass('cocooned-container');
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
        expect(container.querySelectorAll('.cocooned-item').length).toEqual(2);
      });
    });
  });
});
