(function ($) {
  var cocoonElementCounter = 0;

  var createNewId = function () {
    return (new Date().getTime() + cocoonElementCounter++);
  };

  var newContentBraced = function (id) {
    return '[' + id + ']$1';
  };

  var newContentUnderscored = function (id) {
    return '_' + id + '_$1';
  };

  var getInsertionNodeElem = function (insertionNode, insertionTraversal, $this) {
    if (!insertionNode) {
      return $this.parent();
    }

    if (typeof insertionNode === 'function') {
      if (insertionTraversal) {
        console.warn('association-insertion-traversal is ignored, because association-insertion-node is given as a function.');
      }
      return insertionNode($this);
    }

    if (typeof insertionNode === 'string') {
      if (insertionTraversal) {
        return $this[insertionTraversal](insertionNode);
      }
      return insertionNode === 'this' ? $this : $(insertionNode);
    }
  };

  var nestedFieldsCounter = function (insertionNode, wrapperClass) {
    return $(insertionNode).children('.' + wrapperClass).length;
  };

  $(document).on('click.cocoon', '.add_fields', function (e) {
    e.preventDefault();
    var $this = $(this);
    var assoc = $this.data('association');
    var assocs = $this.data('associations');
    var content = $this.data('association-insertion-template');
    var insertionMethod = $this.data('association-insertion-method') || $this.data('association-insertion-position') || 'before';
    var insertionNode = $this.data('association-insertion-node');
    var insertionTraversal = $this.data('association-insertion-traversal');
    var count = parseInt($this.data('count'), 10);
    var limit = parseInt($this.data('limit'), 10);
    var wrapperClass = $this.data('wrapper-class') || 'nested-fields';
    var regexpBraced = new RegExp('\\[new_' + assoc + '\\](.*?\\s)', 'g');
    var regexpUnderscored = new RegExp('_new_' + assoc + '_(\\w*)', 'g');
    var newId = createNewId();
    var newContent = content.replace(regexpBraced, newContentBraced(newId));
    var newContents = [];

    if (newContent === content) {
      regexpBraced = new RegExp('\\[new_' + assocs + '\\](.*?\\s)', 'g');
      regexpUnderscored = new RegExp('_new_' + assocs + '_(\\w*)', 'g');
      newContent = content.replace(regexpBraced, newContentBraced(newId));
    }

    newContent = newContent.replace(regexpUnderscored, newContentUnderscored(newId));
    newContents = [newContent];

    count = (isNaN(count) ? 1 : Math.max(count, 1));
    count -= 1;

    while (count) {
      newId = createNewId();
      newContent = content.replace(regexpBraced, newContentBraced(newId));
      newContent = newContent.replace(regexpUnderscored, newContentUnderscored(newId));
      newContents.push(newContent);

      count -= 1;
    }

    var insertionNodeElem = getInsertionNodeElem(insertionNode, insertionTraversal, $this);

    if (!insertionNodeElem || (insertionNodeElem.length === 0)) {
      console.warn(
        'Couldn\'t find the element to insert the template. ' +
        'Make sure your `data-association-insertion-*` on `link_to_add_association` is correct.'
      );
    }

    $.each(newContents, function (i, node) {
      var contentNode = $(node);

      if (!isNaN(limit) && nestedFieldsCounter(insertionNodeElem, wrapperClass) >= limit) {
        var limitReached = jQuery.Event('cocoon:lmit-reached', { link: $this });
        insertionNodeElem.trigger(limitReached, [contentNode]);

        return false;
      }

      var beforeInsert = jQuery.Event('cocoon:before-insert', { link: $this });
      insertionNodeElem.trigger(beforeInsert, [contentNode]);

      if (!beforeInsert.isDefaultPrevented()) {
        // allow any of the jquery dom manipulation methods (after, before, append, prepend, etc)
        // to be called on the node.  allows the insertion node to be the parent of the inserted
        // code and doesn't force it to be a sibling like after/before does. default: 'before'
        insertionNodeElem[insertionMethod](contentNode);

        var afterInsert = jQuery.Event('cocoon:after-insert', { link: $this });
        insertionNodeElem.trigger(afterInsert, [contentNode]);
      }
    });
  });

  $(document).on('click.cocoon', '.remove_fields.dynamic, .remove_fields.existing', function (e) {
    var $this = $(this);
    var wrapperClass = $this.data('wrapper-class') || 'nested-fields';
    var nodeToDelete = $this.closest('.' + wrapperClass);
    var triggerNode = nodeToDelete.parent();

    e.preventDefault();

    var beforeRemove = jQuery.Event('cocoon:before-remove');
    triggerNode.trigger(beforeRemove, [nodeToDelete]);

    if (!beforeRemove.isDefaultPrevented()) {
      var timeout = triggerNode.data('remove-timeout') || 0;

      setTimeout(function () {
        if ($this.hasClass('dynamic')) {
          nodeToDelete.detach();
        } else {
          nodeToDelete.find('input[required], select[required]').each(function (index, element) {
            $(element).removeAttr('required');
          });
          $this.prev('input[type=hidden]').val('1');
          nodeToDelete.hide();
        }
        triggerNode.trigger('cocoon:after-remove', [nodeToDelete]);
      }, timeout);
    }
  });

  var hideMarkedForDestructionFields = function () {
    $('.remove_fields.existing.destroyed').each(function (i, obj) {
      var $this = $(this);
      var wrapperClass = $this.data('wrapper-class') || 'nested-fields';

      $this.closest('.' + wrapperClass).hide();
    });
  };

  $(hideMarkedForDestructionFields);
  $(document).on('page:load turbolinks:load', hideMarkedForDestructionFields);
})(jQuery);
