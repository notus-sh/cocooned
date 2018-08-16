Cocooned.Plugins.Reorderable = {

  defaultOptionValue: true,

  bindReorderable: function() {
    var self = this;

    this.container
      // Maintain indexes
      .on('cocooned:after-insert',  function(e) { self.reindex(); })
      .on('cocooned:after-remove',  function(e) { self.reindex(); })
      .on('cocooned:after-move',    function(e) { self.reindex(); })
      .on('click.cocooned', '.cocooned-move-up, .cocooned-move-down', function(e) {
        e.preventDefault();
        self.move(this, this.className.indexOf('cocooned-move-up') != -1 ? 'up' : 'down');
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

    // Move can be prevented through a 'cocooned:before-move' event handler
    var eventData = { link: $mover, node: node, cocooned: this };
    if (!self.notify(node, 'before-move', eventData)) {
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
        self.notify(movedNode, 'after-move', eventData);
      });
    });
  },

  reindex: function() {
    var self = this;
    var i = 0;
    var nodes = this.getNodes(':visible');
    var eventData = { link: null, nodes: nodes, cocooned: this };

    // Reindex can be prevented through a 'cocooned:before-reindex' event handler
    if (!this.notify(this.container, 'before-reindex', eventData)) {
      return false;
    }

    nodes.each(function() { $('input[id$=_position]', this).val(++i); });
    this.notify(this.container, 'after-reindex', eventData);
  },

  show: function(node, callback) {
    callback = callback || function() {};

    node.addClass('cocooned-visible-item');
    setTimeout(function() {
      callback.apply(node);
      node.removeClass('cocooned-hidden-item');
    }, 500);
  },

  hide: function(node, callback) {
    node.removeClass('cocooned-visible-item').addClass('cocooned-hidden-item');
    if (callback) {
      setTimeout(function() {
        callback.apply(node);
      }, 500);
    }
  }
};
