;(function(w, $) {
  'use strict';

  $.fn.cocoon = function(options) {
    return this.each(function() {
      var container = $(this);

      if (typeof container.data('cocoon') !== 'undefined') {
        if (typeof w.console !== 'undefined') {
          w.console.warn('Cocoon already initialized on this element.');
          w.console.debug(container);
        }
        return;
      }

      var cocoon = new Cocoon(container, options);
      container.data('cocoon', cocoon);
    });
  };
})(window, jQuery);
