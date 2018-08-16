var Cocooned = function (container, options) {
  this.container = jQuery(container);
  this.options = jQuery.extend({}, this.defaultOptions(), (options || {}));

  // Autoload plugins
  for (var moduleName in Cocooned.Plugins) {
    if (Cocooned.Plugins.hasOwnProperty(moduleName)) {
      var module = Cocooned.Plugins[moduleName];
      var optionName = moduleName.charAt(0).toLowerCase() + moduleName.slice(1);

      if (this.options[optionName]) {
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

Cocooned.Plugins = {};
Cocooned.prototype = {

  elementsCounter: 0,

  // Compatibility with Cocoon
  // TODO: Remove in 2.0 (Only Cocoon namespaces).
  namespaces: {
    events: ['cocooned', 'cocoon']
  },

  // Compatibility with Cocoon
  // TODO: Remove in 2.0 (Only Cocoon class names).
  classes: {
    // Actions link
    add:        ['cocooned-add', 'add_fields'],
    remove:     ['cocooned-remove', 'remove_fields'],
    up:         ['cocooned-move-up'],
    down:       ['cocooned-move-down'],
    // Containers
    container:  ['cocooned-container'],
    item:       ['cocooned-item', 'nested-fields'],
  },

  defaultOptions: function () {
    var options = {};

    for (var moduleName in Cocooned.Plugins) {
      if (Cocooned.Plugins.hasOwnProperty(moduleName)) {
        var module = Cocooned.Plugins[moduleName];
        var optionName = moduleName.charAt(0).toLowerCase() + moduleName.slice(1);

        options[optionName] = module.defaultOptionValue;
      }
    }

    return options;
  },

  notify: function (node, eventType, eventData) {
    return !(this.namespaces.events.some(function(namespace) {
      var namespacedEventType = [namespace, eventType].join(':');
      var event = jQuery.Event(namespacedEventType, eventData);

      node.trigger(event, [eventData.node, eventData.cocooned]);

      return (event.isPropagationStopped() || event.isDefaultPrevented());
    }));
  },

  selector: function (type, selector) {
    var s = selector || '&';
    return this.classes[type].map(function(klass) { return s.replace(/&/, '.' + klass); }).join(', ');
  },

  buildId: function () {
    return (new Date().getTime() + this.elementsCounter++);
  },

  buildContentNode: function (content) {
    var id = this.buildId();
    var html = (content || this.content);
    var braced = '[' + id + ']';
    var underscored = '_' + id + '_';

    ['associations', 'association'].forEach(function (a) {
      html = html.replace(this.regexps[a]['braced'], braced + '$1');
      html = html.replace(this.regexps[a]['underscored'], underscored + '$1');
    }, this);

    return $(html);
  },

  getInsertionNode: function (adder) {
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

  getItems: function (selector) {
    selector = selector || '';
    var self = this;
    return $(this.selector('item', selector), this.container).filter(function () {
      return ($(this).closest(self.selector('container')).get(0) === self.container.get(0));
    });
  },

  findContainer: function (addLink) {
    var $adder = $(addLink);
    var insertionNode = this.getInsertionNode($adder);
    var insertionMethod = this.getInsertionMethod($adder);

    switch (insertionMethod) {
      case 'before':
      case 'after':
      case 'replaceWith':
        return insertionNode.parent();

      case 'append':
      case 'prepend':
      default:
        return insertionNode;
    }
  },

  findItem: function (removeLink) {
    return $(removeLink).closest(this.selector('item'));
  },

  init: function () {
    var self = this;

    this.addLinks = $(this.selector('add')).filter(function () {
      var container = self.findContainer(this);
      return (container.get(0) === self.container.get(0));
    });

    var addLink = $(this.addLinks.get(0));

    this.content = addLink.data('association-insertion-template');
    this.regexps = {
      association: {
        braced: new RegExp('\\[new_' + addLink.data('association') + '\\](.*?\\s)', 'g'),
        underscored: new RegExp('_new_' + addLink.data('association') + '_(\\w*)', 'g')
      },
      associations: {
        braced: new RegExp('\\[new_' + addLink.data('associations') + '\\](.*?\\s)', 'g'),
        underscored: new RegExp('_new_' + addLink.data('associations') + '_(\\w*)', 'g')
      }
    };

    this.initUi();
    this.bindEvents();
  },

  initUi: function () {
    var self = this;

    if (!this.container.attr('id')) {
      this.container.attr('id', this.buildId());
    }
    this.container.addClass(this.classes['container'].join(' '));

    $(function () { self.hideMarkedForDestruction(); });
    $(document).on('page:load turbolinks:load', function () { self.hideMarkedForDestruction(); });
  },

  bindEvents: function () {
    var self = this;

    // Bind add links
    this.addLinks.on('click.cocooned', function (e) {
      e.preventDefault();
      self.add(this);
    });

    // Bind remove links
    // (Binded on document instead of container to not bypass click handler defined in jquery_ujs)
    $(document).on('click.cocooned', this.selector('remove', '#' + this.container.attr('id') + ' &'), function (e) {
      e.preventDefault();
      self.remove(this);
    });

    // Bind options events
    $.each(this.options, function (name, value) {
      var bindMethod = 'bind' + name.charAt(0).toUpperCase() + name.slice(1);
      if (value && self[bindMethod]) {
        self[bindMethod]();
      }
    });
  },

  add: function (adder) {
    var $adder = $(adder);
    var insertionMethod = this.getInsertionMethod($adder);
    var insertionNode = this.getInsertionNode($adder);
    var contentTemplate = $adder.data('association-insertion-template');
    var count = parseInt($adder.data('count'), 10) || 1;

    for (var i = 0; i < count; i++) {
      var contentNode = this.buildContentNode(contentTemplate);
      var eventData = { link: $adder, node: contentNode, cocooned: this };
      var afterNode = (insertionMethod === 'replaceWith' ? contentNode : insertionNode);

      // Insertion can be prevented through a 'cocooned:before-insert' event handler
      if (!this.notify(insertionNode, 'before-insert', eventData)) {
        return false;
      }

      insertionNode[insertionMethod](contentNode);

      this.notify(afterNode, 'after-insert', eventData);
    }
  },

  remove: function (remover) {
    var self = this;
    var $remover = $(remover);
    var nodeToDelete = this.findItem($remover);
    var triggerNode = nodeToDelete.parent();
    var eventData = { link: $remover, node: nodeToDelete, cocooned: this };

    // Deletion can be prevented through a 'cocooned:before-remove' event handler
    if (!this.notify(triggerNode, 'before-remove', eventData)) {
      return false;
    }

    var timeout = triggerNode.data('remove-timeout') || 0;

    setTimeout(function () {
      if ($remover.hasClass('dynamic')) {
        nodeToDelete.remove();
      } else {
        nodeToDelete.find('input[required], select[required]').each(function (index, element) {
          $(element).removeAttr('required');
        });
        $remover.siblings('input[type=hidden][name$="[_destroy]"]').val('true');
        nodeToDelete.hide();
      }
      self.notify(triggerNode, 'after-remove', eventData);
    }, timeout);
  },

  hideMarkedForDestruction: function () {
    var self = this;
    $(this.selector('remove', '&.existing.destroyed'), this.container).each(function (i, removeLink) {
      var node = self.findItem(removeLink);
      node.hide();
    });
  }
};
