/* globals jasmine, describe, it, beforeEach, afterEach, expect, spyOn */
/* globals setup, teardown */

describe('A reorderable cocooned setup', function () {
  beforeEach(setup('reorderable'));
  afterEach(teardown());

  describe('with at least two items', function () {
    beforeEach(function () {
      for (var i = 0, count = Math.ceil(Math.random() * 12); i <= count; i++) {
        $('.cocooned-add').trigger('click');
      }
    });

    describe('should reindex items on click', function () {
      var cocooned;

      beforeEach(function () {
        jasmine.clock().install();

        cocooned = this.wrapper.data('cocooned');
        spyOn(cocooned, 'reindex').and.callThrough();
      });

      afterEach(function () {
        jasmine.clock().uninstall();
      });

      it('on the association add link', function () {
        $('.cocooned-add').trigger('click');
        jasmine.clock().tick(1);
        expect(cocooned.reindex).toHaveBeenCalled();
      });

      it('on an association remove link', function () {
        $('.cocooned-remove').first().trigger('click');
        jasmine.clock().tick(1);
        expect(cocooned.reindex).toHaveBeenCalled();
      });

      it('on an association move up link', function () {
        var items = this.wrapper.find('.nested-fields:visible:not(:first)');
        var index = Math.floor(Math.random() * items.length);
        var item = $(items.get(index));

        item.find('.cocooned-move-up').trigger('click');
        jasmine.clock().tick(1010);
        expect(cocooned.reindex).toHaveBeenCalled();
      });

      it('on an association move down link', function () {
        var items = this.wrapper.find('.nested-fields:visible:not(:last)');
        var index = Math.floor(Math.random() * items.length);
        var item = $(items.get(index));

        item.find('.cocooned-move-down').trigger('click');
        jasmine.clock().tick(1010);
        expect(cocooned.reindex).toHaveBeenCalled();
      });

      describe('and reindexed items', function () {
        beforeEach(function () {
          $('.cocooned-add').trigger('click');
          jasmine.clock().tick(1);
        });

        it('sould have correct positions', function () {
          this.wrapper.find('.nested-fields:visible').each(function (i, item) {
            expect(parseInt($(item).find('input[name$="[position]"]').val(), 10)).toEqual(i + 1);
          });
        });
      });
    });

    describe('on click on an association move link', function () {
      beforeEach(function () {
        jasmine.clock().install();
      });

      afterEach(function () {
        jasmine.clock().uninstall();
      });

      describe('moving an item down', function () {
        it('should move the matching item down', function () {
          var movableItems = this.wrapper.find('.nested-fields:visible:not(:last)');
          var originalIndex = Math.floor(Math.random() * movableItems.length);
          var originalPosition = originalIndex + 1;
          var movedItem = $(movableItems.get(originalIndex));

          expect(parseInt($(movedItem).find('input[name$="[position]"]').val(), 10)).toEqual(originalPosition);

          movedItem.find('.cocooned-move-down').trigger('click');
          jasmine.clock().tick(1010);

          expect(parseInt($(movedItem).find('input[name$="[position]"]').val(), 10)).toEqual(originalPosition + 1);
        });
      });

      describe('moving an item up', function () {
        it('should move the matching item up', function () {
          var movableItems = this.wrapper.find('.nested-fields:visible:not(:first)');
          var originalIndex = Math.floor(Math.random() * movableItems.length);
          var originalPosition = originalIndex + 2; // :not(:first)
          var movedItem = $(movableItems.get(originalIndex));

          expect(parseInt($(movedItem).find('input[name$="[position]"]').val(), 10)).toEqual(originalPosition);

          movedItem.find('.cocooned-move-up').trigger('click');
          jasmine.clock().tick(1010);

          expect(parseInt($(movedItem).find('input[name$="[position]"]').val(), 10)).toEqual(originalPosition - 1);
        });
      });
    });
  });
});
