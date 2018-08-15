//= require_self
//= require_tree './cocoon/plugins'

Cocoon = function(container, options) {
  this.container = jQuery(container);
  this.options = jQuery.extend({}, this.defaultOptions(), (options || {}));

  // Autoload plugins
  for(var module_name in Cocoon.Plugins) {
    if (Cocoon.Plugins.hasOwnProperty(module_name)) {
      var module = Cocoon.Plugins[module_name];
      var option_name = module_name.charAt(0).toLowerCase() + module_name.slice(1);

      if (this.options[option_name]) {
        for (var method in module) {
          if (module.hasOwnProperty(method) && typeof module[method] === 'function') {
            this[method] = module[method];
          }
        }
      }
    }
  }

  this.init();
};

Cocoon.Plugins = {};
Cocoon.prototype = {

  elementsCounter:    0,

  addLinkSelector:    '.add_fields',
  removeLinkSelector: '.remove_fields',
  siblingsSelector:   '.nested-fields',

  defaultOptions: function() {
    var options = {};

    for(var module_name in Cocoon.Plugins) {
      if (Cocoon.Plugins.hasOwnProperty(module_name)) {
        var module = Cocoon.Plugins[module_name];
        var option_name = module_name.charAt(0).toLowerCase() + module_name.slice(1);

        options[option_name] = module.defaultOptionValue;
      }
    }

    return options;
  },

  notify: function(node, event_type, event_data) {
    var event = jQuery.Event(event_type, event_data);
    node.trigger(event, [event_data.node, event_data.cocoon]);
    return !(event.isPropagationStopped() || event.isDefaultPrevented());
  },

  buildId: function () {
    return (new Date().getTime() + this.elementsCounter++)
  },

  buildContentNode: function(content) {
    var id = this.buildId();
    var content = (content || this.content);
    var braced = '[' + id + ']';
    var underscord = '_' + id + '_';

    ['associations', 'association'].forEach(function(a) {
      content = content.replace(this.regexps[a]['braced'], braced + '$1');
      content = content.replace(this.regexps[a]['underscord'], underscord + '$1');
    }, this);

    return $(content);
  },

  getInsertionNode: function(adder) {
    var $adder = $(adder);
    var insertionNode = $adder.data('association-insertion-node');
    var insertionTraversal = $adder.data('association-insertion-traversal');

    if (!insertionNode) {
      return $adder.parent();
    }

    if (typeof insertionNode === 'function') {
      return insertionNode($adder);
    }

    if (insertionTraversal) {
      return $adder[insertionTraversal](insertionNode);
    }

    return insertionNode === 'this' ? $adder : $(insertionNode);
  },

  getInsertionMethod: function (adder) {
    var $adder = $(adder);
    return $adder.data('association-insertion-method') || 'before';
  },

  getNodes: function(selector) {
    selector = selector || '';
    var self = this;
    return $(this.siblingsSelector + selector, this.container).filter(function() {
      return ($(this).closest('.cocoon-container').get(0) === self.container.get(0));
    });
  },

  findContainer: function(addLink) {
    var $adder = $(addLink);
    var insertionNode = this.getInsertionNode($adder);
    var insertionMethod = this.getInsertionMethod($adder);

    switch (insertionMethod) {
      case 'before':
      case 'after':
      case 'replaceWith':
        return insertionNode.parent();
        break;

      case 'append':
      case 'prepend':
      default:
        return insertionNode;
        break;
    }
  },

  findItem: function(removeLink) {
    var $remover = $(removeLink);
    var selector = '.' + ($remover.data('wrapper-class') || 'nested-fields');
    return $remover.closest(selector);
  },

  init: function() {
    var self = this;

    this.addLinks = $(this.addLinkSelector).filter(function() {
      var container = self.findContainer(this);
      return (container.get(0) == self.container.get(0));
    });

    var addLink = $(this.addLinks.get(0));

    this.content = addLink.data('association-insertion-template');
    this.regexps = {
      association: {
        braced:     new RegExp('\\[new_' + addLink.data('association') + '\\](.*?\\s)', 'g'),
        underscord: new RegExp('_new_' + addLink.data('association') + '_(\\w*)', 'g')
      },
      associations: {
        braced:     new RegExp('\\[new_' + addLink.data('associations') + '\\](.*?\\s)', 'g'),
        underscord: new RegExp('_new_' + addLink.data('associations') + '_(\\w*)', 'g')
      }
    };

    this.initUi();
    this.bindEvents();
  },

  initUi: function() {
    var self = this;

    if (!this.container.attr('id')) {
      this.container.attr('id', this.buildId());
    }
    this.container.addClass('cocoon-container');

    $(function() { self.hideMarkedForDestruction(); });
    $(document).on('page:load turbolinks:load', function() { self.hideMarkedForDestruction(); });
  },

  bindEvents: function() {
    var self = this;

    // Bind add links
    this.addLinks.on('click.cocoon', function(e) {
      e.preventDefault();
      self.add(this);
    });

    // Bind remove links
    // (Binded on document instead of container to not bypass click handler defined in jquery_ujs)
    $(document).on('click.cocoon', ('#' + this.container.attr('id') + ' ' + this.removeLinkSelector), function(e) {
      e.preventDefault();
      self.remove(this);
    });
  },

  add: function(adder) {
    var $adder = $(adder);
    var insertionMethod = this.getInsertionMethod($adder);
    var insertionNode = this.getInsertionNode($adder);
    var contentTemplate = $adder.data('association-insertion-template');
    var count = parseInt($adder.data('count'), 10) || 1;

    for (var i = 0; i < count; i++) {
      var contentNode = this.buildContentNode(contentTemplate);
      var eventData = { link: $adder, node: contentNode, cocoon: this };
      var afterNode = (insertionMethod === 'replaceWith' ? contentNode : insertionNode);

      // Insertion can be prevented through a 'cocoon:before-insert' event handler
      if (!this.notify(insertionNode, 'cocoon:before-insert', eventData)) {
        return false;
      }

      insertionNode[insertionMethod](contentNode);

      this.notify(afterNode, 'cocoon:after-insert', eventData);
    }
  },

  remove: function(remover) {
    var self = this;
    var $remover = $(remover);
    var nodeToDelete = this.findItem($remover);
    var triggerNode = nodeToDelete.parent();
    var eventData = { link: $remover, node: nodeToDelete, cocoon: this };

    // Deletion can be prevented through a 'cocoon:before-remove' event handler
    if (!this.notify(triggerNode, 'cocoon:before-remove', eventData)) {
      return false;
    }

    var timeout = triggerNode.data('remove-timeout') || 0;

    setTimeout(function() {
      if ($remover.hasClass('dynamic')) {
        nodeToDelete.remove();
      } else {
        nodeToDelete.find('input[required], select[required]').each(function (index, element) {
          $(element).removeAttr('required');
        });
        $remover.siblings('input[type=hidden][name$="[_destroy]"]').val("true");
        nodeToDelete.hide();
      }
      self.notify(triggerNode, 'cocoon:after-remove', eventData);
    }, timeout);
  },

  hideMarkedForDestruction: function() {
    $('.remove_fields.existing.destroyed', this.container).each(function(i, removeLink) {
      var node = this.findItem(removeLink);
      node.hide();
    });
  }
};
