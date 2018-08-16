/* globals jasmine, describe, it, beforeEach, afterEach, expect, templates */

describe('With a count', function () {

  beforeEach(setup('add-links-count'));
  afterEach(teardown());

  describe('a click on the association add link', function() {
    beforeEach(function() {
      $('.cocooned-add').trigger('click');
    });

    it("should add the requested number of items", function() {
      expect(this.wrapper.children('.nested-fields').length).toEqual(3);
    });
  });
});
