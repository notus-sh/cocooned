Cocoon.Plugins.Limit = {

  defaultOptionValue: false,

  bindLimit: function() {
    this.limit = this.options['limit'];
    this.container.on('cocoon:before-insert', function(e) {
      var cocoon = e.cocoon;
      if (cocoon.getLength() < cocoon.limit) {
        return;
      }

      e.stopPropagation();
      var eventData = { link: e.link, node: e.node, cocoon: cocoon };
      cocoon.notify(cocoon.container, 'cocoon:limit-reached', eventData);
    });
  },

  getLength: function() {
    return this.getNodes(':visible').length;
  }
};
