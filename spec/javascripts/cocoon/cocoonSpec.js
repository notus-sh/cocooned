describe('cocoon', function () {

  var itemsWrapper;

  beforeEach(function(){
    $(formTemplate).appendTo('body');
    itemsWrapper = $('.nested-form');
  });

  afterEach(function(){
    $('#form-template').remove()
  });


  describe('on page load', function() {
    it("should do nothing", function() {
      expect(itemsWrapper.children().length).toEqual(1);
    });
  });

  describe('on click on the association add link', function() {
    beforeEach(function() {
      $('.add_fields').trigger('click');
    });

    it("should add an item", function() {
      expect(itemsWrapper.children().length).toEqual(2);
    });
  });

  describe('on click on an association remove link', function() {
    beforeEach(function() {
      jasmine.clock().install();
      $('.remove_fields').first().trigger('click');
    });

    it("should remove an item", function() {
      jasmine.clock().tick(1);
      expect(itemsWrapper.children(':visible').length).toEqual(0);
    });

    afterEach(function() {
      jasmine.clock().uninstall();
    });
  });
});
