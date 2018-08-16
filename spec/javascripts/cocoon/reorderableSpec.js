/* globals jasmine, describe, it, beforeEach, afterEach, expect, templates */
/* globals shouldBeCorrectlyNamed, nestedFieldNameRegexp, nestedFieldIdRegexp */

describe('A reorderable cocoon setup', function () {

  beforeEach(setup('reorderable'));
  afterEach(teardown());

  describe('with at least two items', function () {

    beforeEach(function () {
      $('.add_fields').trigger('click');
    });

    describe('should reindex items on click', function () {
      var cocoon;

      beforeEach(function () {
        jasmine.clock().install();

        cocoon = this.wrapper.data('cocoon');
        spyOn(cocoon, 'reindex').and.callThrough();
      });

      afterEach(function () {
        jasmine.clock().uninstall();
      });

      it("on the association add link", function () {
        $('.add_fields').trigger('click');
        jasmine.clock().tick(1);
        expect(cocoon.reindex).toHaveBeenCalled();
      });

      it("on an association remove link", function () {
        $('.remove_fields').first().trigger('click');
        jasmine.clock().tick(1);
        expect(cocoon.reindex).toHaveBeenCalled();
      });

      it("on an association move up link", function () {
        $('.cocoon-move-up').last().trigger('click');
        jasmine.clock().tick(1000);
        expect(cocoon.reindex).toHaveBeenCalled();
      });

      it("on an association move down link", function () {
        $('.cocoon-move-down').first().trigger('click');
        jasmine.clock().tick(1000);
        expect(cocoon.reindex).toHaveBeenCalled();
      });

      describe('and reindexed items', function () {

        beforeEach(function () {
          $('.add_fields').trigger('click');
          jasmine.clock().tick(1);
        });

        it("sould have correct positions", function () {
          this.wrapper.find('.nested-fields:visible').each(function (i, item) {
            expect(parseInt($(item).find('input[name$="[position]"]').val(), 10)).toEqual(i + 1);
          });
        });
      });
    });

    describe('on click on an association move link', function() {

      beforeEach(function () {
        for (var i = 0, count = Math.ceil(Math.random() * 12); i <= count; i++) {
          $('.add_fields').trigger('click');
        }
        jasmine.clock().install();
      });

      afterEach(function () {
        jasmine.clock().uninstall();
      });

      describe("moving an item down", function () {
        it('should move the matching item down', function () {
          var movableItems = this.wrapper.find('.nested-fields:visible:not(:last)');
          var originalIndex = Math.floor(Math.random() * movableItems.length);
          var originalPosition = originalIndex + 1;
          var movedItem = $(movableItems.get(originalIndex));

          expect(parseInt($(movedItem).find('input[name$="[position]"]').val(), 10)).toEqual(originalPosition);

          movedItem.find('.cocoon-move-down').trigger('click');
          jasmine.clock().tick(1000);

          expect(parseInt($(movedItem).find('input[name$="[position]"]').val(), 10)).toEqual(originalPosition + 1);
        });
      });

      describe("moving an item up", function () {
        it('should move the matching item up', function() {
          var movableItems = this.wrapper.find('.nested-fields:visible:not(:first)');
          var originalIndex = Math.floor(Math.random() * movableItems.length);
          var originalPosition = originalIndex + 2; // :not(:first)
          var movedItem = $(movableItems.get(originalIndex));

          expect(parseInt($(movedItem).find('input[name$="[position]"]').val(), 10)).toEqual(originalPosition);

          movedItem.find('.cocoon-move-up').trigger('click');
          jasmine.clock().tick(1000);

          expect(parseInt($(movedItem).find('input[name$="[position]"]').val(), 10)).toEqual(originalPosition - 1);
        });
      });
    });
  });
});
