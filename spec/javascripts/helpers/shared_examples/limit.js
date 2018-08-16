/* eslint no-unused-vars: 0 */

function shouldHonoreTheLimit (pendingSpec) {
  return function() {
    var eventSpy;

    beforeEach(function() {
      eventSpy = jasmine.createSpy('eventSpy');
      $(document).on('cocooned:limit-reached', eventSpy);

      $('.cocooned-add').trigger('click');
      $('.cocooned-add').trigger('click');
    });

    afterEach(function() {
      $(document).off('cocooned:limit-reached');
    });

    it("should not add more items than allowed", function() {
      pendingSpec && pending("The limit option only works with insertion methods that add childs to the insertion node");
      expect(this.wrapper.children('.nested-fields').length).toEqual(2);
    });

    it("should raise a 'cocooned:limit-reached' event", function() {
      pendingSpec && pending("The limit option only works with insertion methods that add childs to the insertion node");
      expect(eventSpy).toHaveBeenCalled();
      if (!eventSpy.calls.any()) {
        return;
      }

      var event = eventSpy.calls.first().args[0];
      expect(event.type).toEqual('cocooned:limit-reached');
      expect(event.link.get(0)).toEqual($('.cocooned-add').get(0));
    });
  };
}
