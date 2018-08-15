Cocoon.Plugins.Limit = {

  defaultOptionValue: false,

  bindLimit: function() {
    var limit = (this.container.data('association-limit') == undefined ? Infinity : parseInt(this.container.data('association-limit'), 10));
    var errorHandler  = (this.container.data('association-limit-error-handler') || 'warn') + 'OnLimit';

    if (limit == Infinity) {
      return;
    }

    this.limit = limit;
    if (this[errorHandler]) {
      this[errorHandler]();
    }
  },

  warnOnLimit: function() {
    var errorMessage  = this.container.data('association-limit-error');
    var errorTemplate = (this.container.data('association-error-template') || '<span class="error">{{message}}</span>');
    var error = $(errorTemplate.replace('{{message}}', errorMessage));

    this.container.on('cocoon:before-insert', function(e, node, cocoon) {
      if (cocoon.getLength() >= cocoon.limit) {
        e.stopPropagation();

        cocoon.addLinks.each(function() {
          var linkError = error.clone();
          cocoon.container.after(linkError);
          setTimeout(function() {
            linkError.fadeOut(function() { $(this).remove(); })
          }, 5000);
        });
      }
    });
  },

  hideOnLimit: function() {
    this.container
      // Show or hide additional add-link
      .on('cocoon:after-insert', function (e, node, cocoon) { cocoon.toggleAddLinksOnLimit(); })
      .on('cocoon:after-remove', function (e, node, cocoon) { cocoon.toggleAddLinksOnLimit(); })
    ;
    this.toggleAddLinksOnLimit();
  },

  getLength: function() {
    return this.getNodes(':visible').length;
  },

  toggleAddLinksOnLimit: function() {
    if (this.getLength() >= this.limit) {
      this.addLinks.hide();
    } else {
      this.addLinks.show();
    }
  }
};
