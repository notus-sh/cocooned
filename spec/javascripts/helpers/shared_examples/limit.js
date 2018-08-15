function shouldHonoreTheLimit (pendingSpec) {
  return function() {
    var eventSpy;

    beforeEach(function() {
      eventSpy = jasmine.createSpy('eventSpy');
      $(document).on('cocoon:limit-reached', eventSpy);

      $('.add_fields').trigger('click');
      $('.add_fields').trigger('click');
    });

    afterEach(function() {
      $(document).off('cocoon:limit-reached');
    });

    it("should not add more items than allowed", function() {
      pendingSpec && pending("The limit option only works with insertion methods that add childs to the insertion node");
      expect(this.wrapper.children('.nested-fields').length).toEqual(2);
    });

    it("should raise a 'cocoon:limit-reached' event", function() {
      pendingSpec && pending("The limit option only works with insertion methods that add childs to the insertion node");
      expect(eventSpy).toHaveBeenCalled();
      if (!eventSpy.calls.any()) {
        return;
      }

      var event = eventSpy.calls.first().args[0];
      expect(event.type).toEqual('cocoon:limit-reached');
      expect(event.link.get(0)).toEqual($('.add_fields').get(0));
    });
  };
}
