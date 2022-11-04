const Cocooned = require('../../../app/assets/javascripts/cocooned');
const { asAttribute } = require('../../support/helpers');

const itBehavesLikeAnEventListener = require('../shared/eventListener');

describe('A basic Cocooned setup', () => {
  given('template', () => `
    <section>
      ${given.insertionTemplate}
      
      <div>
        <a class="cocooned-add" href="#"
           data-associations="items"
           data-association-insertion-template="${asAttribute(given.insertionTemplate)}">Add</a>
      </div>
    </section>
  `);
  given('insertionTemplate', () => `
    <div class="cocooned-item">
      <a class="cocooned-remove dynamic" href="#">Remove</a>
    </div>
  `);
  given('container', () => document.querySelector('section'));
  given('link', () => document.querySelector('.cocooned-remove'));
  given('event', () => new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  given('item', () => given.container.querySelector('.cocooned-item'));
  given('cocooned', () => new Cocooned(given.container));

  beforeEach(() => {
    document.body.innerHTML = given.template;
    given.cocooned;
  });

  describe('with a listener on before-remove', () => {
    beforeEach(() => { delegate('cocooned:before-remove', ['event', 'node', 'cocooned']); });
    afterEach(() => { abnegate('cocooned:before-remove'); });

    it('triggers a before-remove event', () => {
      const listener = jest.fn();
      given.container.addEventListener('$cocooned:before-remove', listener);
      given.link.dispatchEvent(given.event);

      expect(listener).toHaveBeenCalled();
    });

    itBehavesLikeAnEventListener({
      listen: (listener) => { given.container.addEventListener('$cocooned:before-remove', listener); },
      dispatch: () => { given.link.dispatchEvent(given.event); }
    });

    // See jQuery alternative below
    it.skip('can cancel event if propagation is stopped', () => {
      const listener = jest.fn(e => e.stopPropagation());
      given.container.addEventListener('$cocooned:before-remove', listener);
      given.link.dispatchEvent(given.event);

      expect(given.container.querySelectorAll('.cocooned-item').length).toEqual(1);
    });

    it('can cancel event if propagation is stopped', () => {
      const listener = jest.fn(e => e.stopPropagation());
      $(given.container).on('cocooned:before-remove', listener);
      $(given.link).trigger('click');

      expect(given.container.querySelectorAll('.cocooned-item').length).toEqual(1);
    });

    // See jQuery alternative below
    it.skip('can cancel event if default is prevented', () => {
      const listener = jest.fn(e => e.preventDefault());
      given.container.addEventListener('$cocooned:before-remove', listener);
      given.link.dispatchEvent(given.event);

      expect(given.container.querySelectorAll('.cocooned-item').length).toEqual(1);
    });

    it('can cancel event if default is prevented', () => {
      const listener = jest.fn(e => e.preventDefault());
      $(given.container).on('cocooned:before-remove', listener);
      $(given.link).trigger('click');

      expect(given.container.querySelectorAll('.cocooned-item').length).toEqual(1);
    });
  });

  describe('with a listener on after-remove', () => {
    beforeEach(() => { delegate('cocooned:after-remove', ['event', 'node', 'cocooned']); });
    afterEach(() => { abnegate('cocooned:after-remove'); });

    it('triggers an after-remove event', () => {
      const listener = jest.fn();
      given.container.addEventListener('$cocooned:after-remove', listener);
      given.link.dispatchEvent(given.event);

      expect(listener).toHaveBeenCalled();
    });

    itBehavesLikeAnEventListener({
      listen: (listener) => { given.container.addEventListener('$cocooned:after-remove', listener); },
      dispatch: () => { given.link.dispatchEvent(given.event); }
    });
  });
});
