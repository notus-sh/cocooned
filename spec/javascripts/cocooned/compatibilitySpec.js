/* globals jasmine, describe, it, beforeEach, afterEach, expect */
/* globals setup, teardown */

// TODO: Remove in 3.0
describe('Compatibility with a cocoon setup', function () {
  beforeEach(setup('compatibility'));
  afterEach(teardown());

  describe('on events', function () {
    var beforeEventSpy;

    beforeEach(function () {
      beforeEventSpy = jasmine.createSpy('beforeEventSpy');
      $(document).on('cocoon:before-insert', beforeEventSpy);
      $('.add_fields').trigger('click');
    });

    afterEach(function () {
      $(document).off('cocoon:before-insert');
    });

    it("should raise an event with the 'cocoon' namespace", function () {
      expect(beforeEventSpy).toHaveBeenCalled();
    });
  });

  describe('with old class names', function () {
    describe('on click on the association add link', function () {
      beforeEach(function () {
        $('.add_fields').trigger('click');
      });

      it('should add an item', function () {
        expect(this.wrapper.children('.nested-fields').length).toEqual(2);
      });
    });

    describe('on click on an association remove link', function () {
      beforeEach(function () {
        jasmine.clock().install();
      });

      afterEach(function () {
        jasmine.clock().uninstall();
      });

      it('should remove an item', function () {
        $('.remove_fields').first().trigger('click');
        jasmine.clock().tick(1);
        expect(this.wrapper.children('.nested-fields:visible').length).toEqual(0);
      });
    });
  });
});
