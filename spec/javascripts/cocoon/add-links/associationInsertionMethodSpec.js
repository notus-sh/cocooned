/* globals jasmine, describe, it, beforeEach, afterEach, expect, templates */

describe('With a different association insertion method', function () {

  beforeEach(setup('add-links-association-insertion-method'));
  afterEach(teardown());

  describe('a click on the association add link', function() {
    beforeEach(function() {
      $('.add_fields').trigger('click');
    });

    it("should add an item at the right place", function() {
      var addLink = $('.add_fields');
      var addedItem = this.wrapper.children('.nested-fields').last();

      expect(addLink.parent().next().get(0)).toEqual(addedItem.get(0));
    });
  });
});
