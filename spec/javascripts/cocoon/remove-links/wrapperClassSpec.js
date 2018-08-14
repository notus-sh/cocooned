describe('With a different items wrapper class', function () {

  var itemsWrapper;

  beforeEach(function(){
    $(templates['remove-links-wrapper-class']).appendTo('body');
    itemsWrapper = $('.nested-form');
  });

  afterEach(function(){
    $('#form-template').remove()
  });


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
      expect(itemsWrapper.children('.nested-item:visible').length).toEqual(0);
    });
  });
});
