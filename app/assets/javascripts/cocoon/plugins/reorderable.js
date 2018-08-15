Cocoon.Plugins.Reorderable = {

  defaultOptionValue: true,

  bindReorderable: function() {
    var self = this;

    this.container
      // Maintain indexes
      .on('cocoon:after-insert',  function(e) { self.reindex(); })
      .on('cocoon:after-remove',  function(e) { self.reindex(); })
      .on('cocoon:after-move',    function(e) { self.reindex(); })
      .on('click', '.cocoon-move-up, .cocoon-move-down', function(e) {
        e.preventDefault();
        self.move(this, this.className.indexOf('cocoon-move-up') != -1 ? 'up' : 'down');
      });

    // Ensure positions are unique before save
    this.container.closest('form').on('submit', function(e) { self.reindex(); });
  },

  move: function(moveLink, direction) {
    var self = this;
    var $mover = $(moveLink);
    var node = $mover.closest(this.siblingsSelector);
    var siblings = (direction == 'up'
        ? node.prevAll(this.siblingsSelector + ':eq(0)')
        : node.nextAll(this.siblingsSelector + ':eq(0)'));

    if (siblings.length == 0) {
      return;
    }

    // Move can be prevented through a 'cocoon:before-move' event handler
    var eventData = { link: $mover, node: node, cocoon: this };
    if (!self.notify(node, 'cocoon:before-move', eventData)) {
      return false;
    }

    var height = self.container.outerHeight();
    var width = self.container.outerWidth();

    self.container.css('height', height).css('width', width);
    self.hide(node, function() {
      var movedNode = $(this).detach();
      movedNode[(direction == 'up' ? 'insertBefore' : 'insertAfter')](siblings);

      self.show(movedNode, function() {
        self.container.css('height', '').css('width', ''); // Object notation does not work here.
        self.notify(movedNode, 'cocoon:after-move', eventData);
      });
    });
  },

  reindex: function() {
    var self = this;
    var i = 0;
    var nodes = this.getNodes(':visible');
    var eventData = { link: $mover, nodes: nodes, cocoon: this };

    // Reindex can be prevented through a 'cocoon:before-reindex' event handler
    if (!this.notify(this.container, 'cocoon:before-reindex', eventData)) {
      return false;
    }

    nodes.each(function() { $('input[id$=_position]', this).val(++i); });
    this.notify(this.container, 'cocoon:after-reindex', eventData);
  },

  show: function(node, callback) {
    callback = callback || function() {};

    node.addClass('cocoon-visible-item');
    setTimeout(function() {
      callback.apply(node);
      node.removeClass('cocoon-hidden-item');
    }, 500);
  },

  hide: function(node, callback) {
    node.removeClass('cocoon-visible-item').addClass('cocoon-hidden-item');
    if (callback) {
      setTimeout(function() {
        callback.apply(node);
      }, 500);
    }
  }
};
