/* globals jasmine, describe, it, beforeEach, afterEach, expect, templates */
/* globals shouldBeCorrectlyNamed, nestedFieldNameRegexp, nestedFieldIdRegexp */

describe('A basic cocoon setup', function () {
  var itemsWrapper;

  beforeEach(function () {
    $(templates['basic']).appendTo('body');
    itemsWrapper = $('.nested-form');
  });

  afterEach(function () {
    $('#form-template').remove();
  });

  describe('on page load', function () {
    it('should do nothing', function () {
      expect(itemsWrapper.children('.nested-fields').length).toEqual(1);
    });

    describe('the pre-existing nested item', function () {
      beforeEach(function () {
        this.subject = itemsWrapper.children('.nested-fields').first();
      });

      describe('fields', shouldBeCorrectlyNamed('[0-9]+'));

      it('should have an id field', function () {
        var nameRegExp = nestedFieldNameRegexp('[0-9]+', 'id');
        var idRegExp = nestedFieldIdRegexp('[0-9]+', 'id');

        expect(this.subject.find('input[type="hidden"]').filter(function () {
          return this.name.match(nameRegExp) && this.id.match(idRegExp);
        }).length).toEqual(1);
      });

      it('should have correctly tagged remove link', function () {
        expect(this.subject.find('.remove_fields').attr('class')).toMatch(/existing/);
      });
    });
  });

  describe('on click on the association add link', function () {
    beforeEach(function () {
      $('.add_fields').trigger('click');
    });

    it('should add an item', function () {
      expect(itemsWrapper.children('.nested-fields').length).toEqual(2);
    });

    describe('the newly added item', function () {
      beforeEach(function () {
        this.subject = itemsWrapper.children('.nested-fields').last();
      });

      describe('fields', shouldBeCorrectlyNamed('[0-9]{10,}'));

      it('should not have an id field', function () {
        var nameRegExp = nestedFieldNameRegexp('[0-9]{10,}', 'id');
        var idRegExp = nestedFieldIdRegexp('[0-9]{10,}', 'id');

        expect(this.subject.find('input[type="hidden"]').filter(function () {
          return this.name.match(nameRegExp) && this.id.match(idRegExp);
        }).length).toEqual(0);
      });

      it('should have correctly tagged remove link', function () {
        expect(this.subject.find('.remove_fields').attr('class')).toMatch(/dynamic/);
      });
    });
  });

  describe('on click on the association add link with event handlers', function () {
    var beforeEventSpy;
    var afterEventSpy;

    beforeEach(function () {
      beforeEventSpy = jasmine.createSpy('beforeEventSpy');
      $(document).on('cocoon:before-insert', beforeEventSpy);

      afterEventSpy = jasmine.createSpy('afterEventSpy');
      $(document).on('cocoon:after-insert', afterEventSpy);

      $('.add_fields').trigger('click');
    });

    afterEach(function () {
      $(document).off('cocoon:before-insert');
      $(document).off('cocoon:after-insert');
    });

    it("should raise a 'cocoon:before-insert' event", function () {
      expect(beforeEventSpy).toHaveBeenCalled();

      var args = beforeEventSpy.calls.first().args;
      var event = args[0];
      expect(event.type).toEqual('cocoon:before-insert');
      expect(event.link.get(0)).toEqual($('.add_fields').get(0));

      var node = args[1];
      expect(node.get(0)).toEqual(itemsWrapper.children('.nested-fields').last().get(0));
    });

    it("should raise a 'cocoon:after-insert' event", function () {
      expect(afterEventSpy).toHaveBeenCalled();

      var args = afterEventSpy.calls.first().args;
      var event = args[0];
      expect(event.type).toEqual('cocoon:after-insert');
      expect(event.link.get(0)).toEqual($('.add_fields').get(0));

      var node = args[1];
      expect(node.get(0)).toEqual(itemsWrapper.children('.nested-fields').last().get(0));
    });
  });

  describe('on click on the association add link with canceling event handlers', function () {
    var beforeEventSpy;
    var afterEventSpy;

    beforeEach(function () {
      beforeEventSpy = jasmine.createSpy('beforeEventSpy').and.callFake(function (e) {
        e.preventDefault();
      });
      $(document).on('cocoon:before-insert', beforeEventSpy);

      afterEventSpy = jasmine.createSpy('afterEventSpy');
      $(document).on('cocoon:after-insert', afterEventSpy);

      $('.add_fields').trigger('click');
    });

    afterEach(function () {
      $(document).off('cocoon:before-insert');
      $(document).off('cocoon:after-insert');
    });

    it("should raise a 'cocoon:before-insert' event", function () {
      expect(beforeEventSpy).toHaveBeenCalled();
    });

    it('should not add an item', function () {
      expect(itemsWrapper.children('.nested-fields').length).toEqual(1);
    });

    it("should not raise a 'cocoon:after-insert' event", function () {
      expect(afterEventSpy).not.toHaveBeenCalled();
    });
  });

  describe('on click on an association remove link', function () {
    beforeEach(function () {
      jasmine.clock().install();
    });

    afterEach(function () {
      jasmine.clock().uninstall();
    });

    it('should remove an item', function () {
      $('.remove_fields').first().trigger('click');
      jasmine.clock().tick(1);
      expect(itemsWrapper.children('.nested-fields:visible').length).toEqual(0);
    });

    describe('on a pre-existing item', function () {
      beforeEach(function () {
        this.subject = itemsWrapper.find('.remove_fields.existing').first().closest('.nested-fields');
      });

      it('should mark the item to be destroyed', function () {
        $('.remove_fields', this.subject).trigger('click');
        jasmine.clock().tick(1);

        expect($.contains(itemsWrapper.get(0), this.subject.get(0))).toBeTruthy();
        expect(parseInt(this.subject.find('input[name$="[_destroy]"]').val(), 10)).toEqual(1);
      });
    });

    describe('on a just added item', function () {
      beforeEach(function () {
        $('.add_fields').trigger('click');
        this.subject = itemsWrapper.children('.remove_fields.dynamic').first().closest('.nested-fields');
      });

      it('should remove the item from the DOM', function () {
        $('.remove_fields', this.subject).trigger('click');
        jasmine.clock().tick(1);
        expect($.contains(itemsWrapper.get(0), this.subject.get(0))).toBeFalsy();
      });
    });
  });

  describe('on click on an association remove link with event handlers', function () {
    var beforeEventSpy;
    var afterEventSpy;

    beforeEach(function () {
      jasmine.clock().install();

      beforeEventSpy = jasmine.createSpy('beforeEventSpy');
      $(document).on('cocoon:before-remove', beforeEventSpy);

      afterEventSpy = jasmine.createSpy('afterEventSpy');
      $(document).on('cocoon:after-remove', afterEventSpy);

      var removeLink = $('.remove_fields').first();
      this.subject = removeLink.closest('.nested-fields').get(0);

      removeLink.trigger('click');
      jasmine.clock().tick(1);
    });

    afterEach(function () {
      jasmine.clock().uninstall();
      $(document).off('cocoon:before-remove');
      $(document).off('cocoon:after-remove');
    });

    it("should raise a 'cocoon:before-remove' event", function () {
      expect(beforeEventSpy).toHaveBeenCalled();

      var args = beforeEventSpy.calls.first().args;
      var event = args[0];
      expect(event.type).toEqual('cocoon:before-remove');

      var node = args[1];
      expect(node.get(0)).toEqual(this.subject);
    });

    it("should raise a 'cocoon:after-remove' event", function () {
      expect(afterEventSpy).toHaveBeenCalled();

      var args = afterEventSpy.calls.first().args;
      var event = args[0];
      expect(event.type).toEqual('cocoon:after-remove');

      var node = args[1];
      expect(node.get(0)).toEqual(this.subject);
    });
  });

  describe('on click on an association remove link with canceling event handlers', function () {
    var beforeEventSpy;
    var afterEventSpy;

    beforeEach(function () {
      jasmine.clock().install();

      beforeEventSpy = jasmine.createSpy('beforeEventSpy').and.callFake(function (e) {
        e.preventDefault();
      });
      $(document).on('cocoon:before-remove', beforeEventSpy);

      afterEventSpy = jasmine.createSpy('afterEventSpy');
      $(document).on('cocoon:after-remove', afterEventSpy);

      var removeLink = $('.remove_fields').first();
      this.subject = removeLink.closest('.nested-fields').get(0);

      removeLink.trigger('click');
      jasmine.clock().tick(1);
    });

    afterEach(function () {
      jasmine.clock().uninstall();
      $(document).off('cocoon:before-remove');
      $(document).off('cocoon:after-remove');
    });

    it("should raise a 'cocoon:before-remove' event", function () {
      expect(beforeEventSpy).toHaveBeenCalled();
    });

    it('should not remove the item', function () {
      expect(itemsWrapper.children('.nested-fields').length).toEqual(1);
    });

    it("should not raise a 'cocoon:after-remove' event", function () {
      expect(afterEventSpy).not.toHaveBeenCalled();
    });
  });
});
