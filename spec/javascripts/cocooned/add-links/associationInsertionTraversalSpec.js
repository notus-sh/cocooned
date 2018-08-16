/* globals jasmine, describe, it, beforeEach, afterEach, expect, templates */

describe('With a different association insertion traversal (and node)', function () {

  beforeEach(setup('add-links-association-insertion-traversal'));
  afterEach(teardown());

  describe('a click on the association add link', function() {
    beforeEach(function() {
      $('.cocooned-add').trigger('click');
    });

    it("should add an item at the right place", function() {
      var insertionNode = $('.insertion-node');
      var addedItem = this.wrapper.children('.nested-fields').last();

      expect(insertionNode.prev().get(0)).toEqual(addedItem.get(0));
    });
  });
});
