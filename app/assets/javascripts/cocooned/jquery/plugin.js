;(function(w, $) {
  'use strict';

  $.fn.cocooned = function(options) {
    return this.each(function() {
      var container = $(this);

      if (typeof container.data('cocooned') !== 'undefined') {
        if (typeof w.console !== 'undefined') {
          w.console.warn('Cocooned already initialized on this element.');
          w.console.debug(container);
        }
        return;
      }

      var cocooned = new Cocooned(container, options);
      container.data('cocooned', cocooned);
    });
  };
})(window, jQuery);
