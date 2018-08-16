;(function(w, $) {
  'use strict';

  $(function() {
    $('*[data-cocoon-options]').each(function(el) {
      $(el).cocoon($(el).data('cocoon-options'));
    });
  });

})(window, jQuery);
