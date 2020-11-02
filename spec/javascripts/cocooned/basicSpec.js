/* globals jasmine, describe, it, beforeEach, afterEach, expect */
/* globals setup, teardown, shouldBeCorrectlyNamed, nestedFieldNameRegexp, nestedFieldIdRegexp */

describe('A basic cocooned setup', function () {
  beforeEach(setup('basic'));
  afterEach(teardown());

  describe('on page load', function () {
    it('should do nothing', function () {
      expect(this.wrapper.children('.cocooned-item').length).toEqual(1);
    });

    describe('the pre-existing nested item', function () {
      beforeEach(function () {
        this.subject = this.wrapper.children('.cocooned-item').first();
      });

      describe('fields', shouldBeCorrectlyNamed('[0-9]+'));

      it('should have an id field', function () {
        var nameRegExp = nestedFieldNameRegexp('[0-9]+', 'id');
        var idRegExp = nestedFieldIdRegexp('[0-9]+', 'id');

        expect(this.wrapper.find('input[type="hidden"]').filter(function () {
          return this.name.match(nameRegExp) && this.id.match(idRegExp);
        }).length).toEqual(1);
      });

      it('should have correctly tagged remove link', function () {
        expect(this.subject.find('.cocooned-remove').attr('class')).toMatch(/existing/);
      });
    });
  });

  describe('on click on the association add link', function () {
    beforeEach(function () {
      $('.cocooned-add').trigger('click');
    });

    it('should add an item', function () {
      expect(this.wrapper.children('.cocooned-item').length).toEqual(2);
    });

    describe('the newly added item', function () {
      beforeEach(function () {
        this.subject = this.wrapper.children('.cocooned-item').last();
      });

      describe('fields', shouldBeCorrectlyNamed('[0-9]{10,}'));

      it('should not have an id field', function () {
        var nameRegExp = nestedFieldNameRegexp('[0-9]{10,}', 'id');
        var idRegExp = nestedFieldIdRegexp('[0-9]{10,}', 'id');

        expect(this.wrapper.find('input[type="hidden"]').filter(function () {
          return this.name.match(nameRegExp) && this.id.match(idRegExp);
        }).length).toEqual(0);
      });

      it('should have correctly tagged remove link', function () {
        expect(this.subject.find('.cocooned-remove').attr('class')).toMatch(/dynamic/);
      });
    });
  });

  describe('on click on the association add link with event handlers', function () {
    var beforeEventSpy;
    var afterEventSpy;

    beforeEach(function () {
      beforeEventSpy = jasmine.createSpy('beforeEventSpy');
      $(document).on('cocooned:before-insert', beforeEventSpy);

      afterEventSpy = jasmine.createSpy('afterEventSpy');
      $(document).on('cocooned:after-insert', afterEventSpy);

      $('.cocooned-add').trigger('click');
    });

    afterEach(function () {
      $(document).off('cocooned:before-insert');
      $(document).off('cocooned:after-insert');
    });

    it("should raise a 'cocooned:before-insert' event", function () {
      expect(beforeEventSpy).toHaveBeenCalled();
      if (!beforeEventSpy.calls.any()) {
        return;
      }

      var args = beforeEventSpy.calls.first().args;
      var event = args[0];
      expect(event.type).toEqual('cocooned:before-insert');
      expect(event.link.get(0)).toEqual($('.cocooned-add').get(0));
      expect(event.originalEvent).toBeDefined();

      var node = args[1];
      expect(node.get(0)).toEqual(this.wrapper.children('.cocooned-item').last().get(0));
    });

    it("should raise a 'cocooned:after-insert' event", function () {
      expect(afterEventSpy).toHaveBeenCalled();
      if (!afterEventSpy.calls.any()) {
        return;
      }

      var args = afterEventSpy.calls.first().args;
      var event = args[0];
      expect(event.type).toEqual('cocooned:after-insert');
      expect(event.link.get(0)).toEqual($('.cocooned-add').get(0));
      expect(event.originalEvent).toBeDefined();

      var node = args[1];
      expect(node.get(0)).toEqual(this.wrapper.children('.cocooned-item').last().get(0));
    });
  });

  describe('on click on the association add link with canceling event handlers', function () {
    var beforeEventSpy;
    var afterEventSpy;

    beforeEach(function () {
      beforeEventSpy = jasmine.createSpy('beforeEventSpy').and.callFake(function (e) {
        e.preventDefault();
      });
      $(document).on('cocooned:before-insert', beforeEventSpy);

      afterEventSpy = jasmine.createSpy('afterEventSpy');
      $(document).on('cocooned:after-insert', afterEventSpy);

      $('.cocooned-add').trigger('click');
    });

    afterEach(function () {
      $(document).off('cocooned:before-insert');
      $(document).off('cocooned:after-insert');
    });

    it("should raise a 'cocooned:before-insert' event", function () {
      expect(beforeEventSpy).toHaveBeenCalled();
    });

    it('should not add an item', function () {
      expect(this.wrapper.children('.cocooned-item').length).toEqual(1);
    });

    it("should not raise a 'cocooned:after-insert' event", function () {
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
      $('.cocooned-remove').first().trigger('click');
      jasmine.clock().tick(1);
      expect(this.wrapper.children('.cocooned-item:visible').length).toEqual(0);
    });

    describe('on a pre-existing item', function () {
      beforeEach(function () {
        this.subject = this.wrapper.find('.cocooned-remove.existing').first().closest('.cocooned-item');
      });

      it('should mark the item to be destroyed', function () {
        $('.cocooned-remove', this.subject).trigger('click');
        jasmine.clock().tick(1);

        expect($.contains(this.wrapper.get(0), this.subject.get(0))).toBeTruthy();
        expect(this.subject.find('input[name$="[_destroy]"]').val()).toEqual('true');
      });
    });

    describe('on a just added item', function () {
      beforeEach(function () {
        $('.cocooned-add').trigger('click');
        this.subject = this.wrapper.children('.cocooned-remove.dynamic').first().closest('.cocooned-item');
      });

      it('should remove the item from the DOM', function () {
        $('.cocooned-remove', this.subject).trigger('click');
        jasmine.clock().tick(1);
        expect($.contains(this.wrapper.get(0), this.subject.get(0))).toBeFalsy();
      });
    });
  });

  describe('on click on an association remove link with event handlers', function () {
    var beforeEventSpy;
    var afterEventSpy;

    beforeEach(function () {
      jasmine.clock().install();

      beforeEventSpy = jasmine.createSpy('beforeEventSpy');
      $(document).on('cocooned:before-remove', beforeEventSpy);

      afterEventSpy = jasmine.createSpy('afterEventSpy');
      $(document).on('cocooned:after-remove', afterEventSpy);

      var removeLink = $('.cocooned-remove').first();
      this.subject = removeLink.closest('.cocooned-item').get(0);

      removeLink.trigger('click');
      jasmine.clock().tick(1);
    });

    afterEach(function () {
      jasmine.clock().uninstall();
      $(document).off('cocooned:before-remove');
      $(document).off('cocooned:after-remove');
    });

    it("should raise a 'cocooned:before-remove' event", function () {
      expect(beforeEventSpy).toHaveBeenCalled();
      if (!beforeEventSpy.calls.any()) {
        return;
      }

      var args = beforeEventSpy.calls.first().args;
      var event = args[0];
      expect(event.type).toEqual('cocooned:before-remove');
      expect(event.originalEvent).toBeDefined();

      var node = args[1];
      expect(node.get(0)).toEqual(this.subject);
    });

    it("should raise a 'cocooned:after-remove' event", function () {
      expect(afterEventSpy).toHaveBeenCalled();
      if (!afterEventSpy.calls.any()) {
        return;
      }

      var args = afterEventSpy.calls.first().args;
      var event = args[0];
      expect(event.type).toEqual('cocooned:after-remove');
      expect(event.originalEvent).toBeDefined();

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
      $(document).on('cocooned:before-remove', beforeEventSpy);

      afterEventSpy = jasmine.createSpy('afterEventSpy');
      $(document).on('cocooned:after-remove', afterEventSpy);

      var removeLink = $('.cocooned-remove').first();
      this.subject = removeLink.closest('.cocooned-item').get(0);

      removeLink.trigger('click');
      jasmine.clock().tick(1);
    });

    afterEach(function () {
      jasmine.clock().uninstall();
      $(document).off('cocooned:before-remove');
      $(document).off('cocooned:after-remove');
    });

    it("should raise a 'cocooned:before-remove' event", function () {
      expect(beforeEventSpy).toHaveBeenCalled();
    });

    it('should not remove the item', function () {
      expect(this.wrapper.children('.cocooned-item').length).toEqual(1);
    });

    it("should not raise a 'cocooned:after-remove' event", function () {
      expect(afterEventSpy).not.toHaveBeenCalled();
    });
  });
});
