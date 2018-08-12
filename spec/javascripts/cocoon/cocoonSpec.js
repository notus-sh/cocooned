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

    describe('the pre-existing nested item', function() {
      beforeEach(function() {
        this.subject = itemsWrapper.children().first();
      });

      describe('fields', shouldBeCorrectlyNamed('[0-9]+'));

      it("should have an id field", function() {
        var nameRegExp = nestedFieldNameRegexp('[0-9]+', 'id');
        var idRegExp = nestedFieldIdRegexp('[0-9]+', 'id');

        expect(this.subject.find('input[type="hidden"]').filter(function() {
          return this.name.match(nameRegExp) && this.id.match(idRegExp);
        }).length).toEqual(1);
      });

      it("should have correctly tagged remove link", function() {
        expect(this.subject.find('.remove_fields').attr('class')).toMatch(/existing/);
      });
    });
  });

  describe('on click on the association add link', function() {
    beforeEach(function() {
      $('.add_fields').trigger('click');
    });

    it("should add an item", function() {
      expect(itemsWrapper.children().length).toEqual(2);
    });

    describe('the newly added item', function() {
      var item;

      beforeEach(function() {
        this.subject = itemsWrapper.children().last();
      });

      describe('fields', shouldBeCorrectlyNamed('[0-9]{10,}'));

      it("should not have an id field", function() {
        var nameRegExp = nestedFieldNameRegexp('[0-9]{10,}', 'id');
        var idRegExp = nestedFieldIdRegexp('[0-9]{10,}', 'id');

        expect(this.subject.find('input[type="hidden"]').filter(function() {
          return this.name.match(nameRegExp) && this.id.match(idRegExp);
        }).length).toEqual(0);
      });

      it("should have correctly tagged remove link", function() {
        expect(this.subject.find('.remove_fields').attr('class')).toMatch(/dynamic/);
      });
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
