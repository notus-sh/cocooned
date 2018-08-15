/* globals jasmine, describe, it, beforeEach, afterEach, expect, templates */

describe('With a different items wrapper class', function () {

  beforeEach(setup('remove-links-wrapper-class'));
  afterEach(teardown());

  describe('a click on an association remove link', function() {
    beforeEach(function() {
      jasmine.clock().install();
    });

    afterEach(function() {
      jasmine.clock().uninstall();
    });

    it("should remove an item", function() {
      $('.remove_fields').first().trigger('click');
      jasmine.clock().tick(1);
      expect(this.wrapper.children('.nested-item:visible').length).toEqual(0);
    });
  });
});
