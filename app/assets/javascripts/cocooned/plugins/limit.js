Cocooned.Plugins.Limit = {

  defaultOptionValue: false,

  bindLimit: function() {
    this.limit = this.options['limit'];
    this.container.on('cocooned:before-insert', function(e) {
      var cocooned = e.cocooned;
      if (cocooned.getLength() < cocooned.limit) {
        return;
      }

      e.stopPropagation();
      var eventData = { link: e.link, node: e.node, cocooned: cocooned };
      cocooned.notify(cocooned.container, 'cocooned:limit-reached', eventData);
    });
  },

  getLength: function() {
    return this.getNodes(':visible').length;
  }
};
