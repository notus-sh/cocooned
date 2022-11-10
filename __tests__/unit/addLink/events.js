const Cocooned = require('../../../app/assets/javascripts/cocooned');
const { asAttribute, clickEvent } = require('../../support/helpers');

const itBehavesLikeAnEventListener = require('../shared/eventListener');

describe('A Cocooned setup', () => {
  given('template', () => `
    <section>
      <div>
        <a class="cocooned-add" href="#"
           data-associations="items"
           data-association-insertion-template="${asAttribute(given.insertionTemplate)}">Add</a>
      </div>
    </section>
  `);
  given('insertionTemplate', () => `<div class="cocooned-item"></div>`);
  given('container', () => document.querySelector('section'));
  given('addLink', () => document.querySelector('.cocooned-add'));
  given('item', () => given.container.querySelector('.cocooned-item'));
  given('cocooned', () => new Cocooned(given.container));

  beforeEach(() => {
    document.body.innerHTML = given.template;
    given.cocooned;
  });

  describe('with a listener on before-insert', () => {
    beforeEach(() => { delegate('cocooned:before-insert', ['event', 'node', 'cocooned']); });
    afterEach(() => { abnegate('cocooned:before-insert'); });

    it('triggers a before-insert event', () => {
      const listener = jest.fn();
      given.container.addEventListener('$cocooned:before-insert', listener);
      given.addLink.dispatchEvent(clickEvent());

      expect(listener).toHaveBeenCalled();
    });

    itBehavesLikeAnEventListener({
      listen: (listener) => { given.container.addEventListener('$cocooned:before-insert', listener); },
      dispatch: () => { given.addLink.dispatchEvent(clickEvent()); }
    });

    // See jQuery alternative below
    it.skip('can cancel event if propagation is stopped', () => {
      const listener = jest.fn(e => e.stopPropagation());
      given.container.addEventListener('$cocooned:before-insert', listener);
      given.addLink.dispatchEvent(clickEvent());

      expect(given.container.querySelectorAll('.cocooned-item').length).toEqual(0);
    });

    it('can cancel event if propagation is stopped', () => {
      const listener = jest.fn(e => e.stopPropagation());
      $(given.container).on('cocooned:before-insert', listener);
      $(given.addLink).trigger('click');

      expect(given.container.querySelectorAll('.cocooned-item').length).toEqual(0);
    });

    // See jQuery alternative below
    it.skip('can cancel event if default is prevented', () => {
      const listener = jest.fn(e => e.preventDefault());
      given.container.addEventListener('$cocooned:before-insert', listener);
      given.addLink.dispatchEvent(clickEvent());

      expect(given.container.querySelectorAll('.cocooned-item').length).toEqual(0);
    });

    it('can cancel event if default is prevented', () => {
      const listener = jest.fn(e => e.preventDefault());
      $(given.container).on('cocooned:before-insert', listener);
      $(given.addLink).trigger('click');

      expect(given.container.querySelectorAll('.cocooned-item').length).toEqual(0);
    });
  });

  describe('with a listener on after-insert', () => {
    beforeEach(() => { delegate('cocooned:after-insert', ['event', 'node', 'cocooned']); });
    afterEach(() => { abnegate('cocooned:after-insert'); });

    it('triggers an after-insert event', () => {
      const listener = jest.fn();
      given.container.addEventListener('$cocooned:after-insert', listener);
      given.addLink.dispatchEvent(clickEvent());

      expect(listener).toHaveBeenCalled();
    });

    itBehavesLikeAnEventListener({
      listen: (listener) => { given.container.addEventListener('$cocooned:after-insert', listener); },
      dispatch: () => { given.addLink.dispatchEvent(clickEvent()); }
    });
  });
});
