'use strict';

const $ = require('jquery');
const Cocooned = require('../../app/assets/javascripts/cocooned');

describe('A basic cocooned setup', ()  => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="container">
        <div class="cocooned-item"></div>
        
        <div>
          <a class="cocooned-add"
           href="#"
           data-association="item"
           data-associations="items"
           data-association-insertion-template="&lt;div class=&quot;cocooned-item&quot;&gt;&lt;/div&gt;">Add</a>
        </div>
      </div>
    `;
  });

  describe('once instanced', () => {
    let container;
    let cocooned;

    beforeEach(() => {
      container = document.getElementById('container');
      cocooned = new Cocooned(container);
    });

    it('does not change container content', () => {
      expect(document.querySelectorAll('.cocooned-item').length).toEqual(1);
    });

    it('associates itself with container', () => {
      expect(container.dataset).toHaveProperty('cocooned');
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
