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

      describe('with a listener on before-insert', () => {
        given('listener', () => jest.fn());

        beforeEach(() => {
          delegate('cocooned:before-insert', ['event', 'node', 'cocooned'])
          given.container.addEventListener('$cocooned:before-insert', given.listener);

          given.link.dispatchEvent(given.event);
        });

        afterEach(() => {
          abnegate('cocooned:before-insert', given.listener);
        })

        it('triggers a before-insert event', () => {
          expect(given.listener).toHaveBeenCalled();
        });

        describe('when called', () => {
          let details;
          given('listener', () => jest.fn((e) => {
            details = e.detail;
          }));

          it('receives the event as first argument', () => {
            expect(details.event).toBeInstanceOf(jQuery.Event);
          });

          it('receives the wannabe inserted node as second argument', () => {
            expect(details.node).toBeInstanceOf(jQuery);
          });

          it('receives the Cocooned instance as third argument', () => {
            expect(details.cocooned).toBe(given.cocooned);
          });
        });
      });

      describe('with a listener on after-insert', () => {
        given('listener', () => jest.fn());

        beforeEach(() => {
          delegate('cocooned:after-insert', ['event', 'node', 'cocooned'])
          given.container.addEventListener('$cocooned:after-insert', given.listener);

          given.link.dispatchEvent(given.event);
        });

        afterEach(() => {
          abnegate('cocooned:after-insert', given.listener);
        })

        it('triggers an after-insert event', () => {
          expect(given.listener).toHaveBeenCalled();
        });

        describe('when called', () => {
          let details;
          given('listener', () => jest.fn((e) => {
            details = e.detail;
          }));

          it('receives the event as first argument', () => {
            expect(details.event).toBeInstanceOf(jQuery.Event);
          });

          it('receives the inserted node as second argument', () => {
            expect(details.node).toBeInstanceOf(jQuery);
          });

          it('receives the Cocooned instance as third argument', () => {
            expect(details.cocooned).toBe(given.cocooned);
          });
        });
      });
    });
  });
});
