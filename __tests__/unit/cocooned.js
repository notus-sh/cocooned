const Cocooned = require('../../app/assets/javascripts/cocooned');
const itBehavesLikeAnEventListener = require('./shared/eventListener');

describe('A basic Cocooned setup', () => {
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

      describe('with a listener on before-insert', () => {
        beforeEach(() => { delegate('cocooned:before-insert', ['event', 'node', 'cocooned']); });
        afterEach(() => { abnegate('cocooned:before-insert'); });

        it('triggers a before-insert event', () => {
          const listener = jest.fn();
          given.container.addEventListener('$cocooned:before-insert', listener);
          given.link.dispatchEvent(given.event);

          expect(listener).toHaveBeenCalled();
        });

        itBehavesLikeAnEventListener({
          listen: (listener) => { given.container.addEventListener('$cocooned:before-insert', listener); },
          dispatch: () => { given.link.dispatchEvent(given.event); }
        });

        // See jQuery alternative below
        it.skip('can cancel event if propagation is stopped', () => {
          const listener = jest.fn(e => e.stopPropagation());
          given.container.addEventListener('$cocooned:before-insert', listener);
          given.link.dispatchEvent(given.event);

          expect(given.container.querySelectorAll('.cocooned-item').length).toEqual(1);
        });

        it('can cancel event if propagation is stopped', () => {
          const listener = jest.fn(e => e.stopPropagation());
          $(given.container).on('cocooned:before-insert', listener);
          $(given.link).trigger('click');

          expect(given.container.querySelectorAll('.cocooned-item').length).toEqual(1);
        });

        // See jQuery alternative below
        it.skip('can cancel event if default is prevented', () => {
          const listener = jest.fn(e => e.preventDefault());
          given.container.addEventListener('$cocooned:before-insert', listener);
          given.link.dispatchEvent(given.event);

          expect(given.container.querySelectorAll('.cocooned-item').length).toEqual(1);
        });

        it('can cancel event if default is prevented', () => {
          const listener = jest.fn(e => e.preventDefault());
          $(given.container).on('cocooned:before-insert', listener);
          $(given.link).trigger('click');

          expect(given.container.querySelectorAll('.cocooned-item').length).toEqual(1);
        });
      });

      describe('with a listener on after-insert', () => {
        beforeEach(() => { delegate('cocooned:after-insert', ['event', 'node', 'cocooned']); });
        afterEach(() => { abnegate('cocooned:after-insert'); });

        it('triggers an after-insert event', () => {
          const listener = jest.fn();
          given.container.addEventListener('$cocooned:after-insert', listener);
          given.link.dispatchEvent(given.event);

          expect(listener).toHaveBeenCalled();
        });

        itBehavesLikeAnEventListener({
          listen: (listener) => { given.container.addEventListener('$cocooned:after-insert', listener); },
          dispatch: () => { given.link.dispatchEvent(given.event); }
        });
      });
    });
  });
});
