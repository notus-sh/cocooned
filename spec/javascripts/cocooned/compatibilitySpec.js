/* globals jasmine, describe, it, beforeEach, afterEach, expect */
/* globals setup, teardown */

// TODO: Remove in 2.0
describe('Compatibility with a cocoon setup', function () {
  beforeEach(setup('basic'));
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
});
