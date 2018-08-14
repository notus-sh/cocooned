/* globals jasmine, describe, it, beforeEach, afterEach, expect, templates */

describe('With a count', function () {

  var itemsWrapper;

  beforeEach(function() {
    $(templates['add-links-count']).appendTo('body');
    itemsWrapper = $('.nested-form');
  });

  afterEach(function(){
    $('#form-template').remove()
  });


  describe('a click on the association add link', function() {
    beforeEach(function() {
      $('.add_fields').trigger('click');
    });

    it("should add the requested number of items", function() {
      expect(itemsWrapper.children('.nested-fields').length).toEqual(3);
    });
  });
});
