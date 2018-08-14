describe('With a different association insertion method', function () {

  var itemsWrapper;

  beforeEach(function(){
    $(templates['add-links-insertion-method']).appendTo('body');
    itemsWrapper = $('.nested-form');
  });

  afterEach(function(){
    $('#form-template').remove()
  });


  describe('a click on the association add link', function() {
    beforeEach(function() {
      $('.add_fields').trigger('click');
    });

    it("should add an item at the right place", function() {
      var addLink = $('.add_fields');
      var addedItem = itemsWrapper.children('.nested-fields').last();

      expect(addLink.parent().next().get(0)).toEqual(addedItem.get(0));
    });
  });
});
