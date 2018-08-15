;(function(w, $) {
  'use strict';

  $(function() {
    $('*[data-cocoon-options]').each(function() {
      $(el).cocoon($(el).data('cocoon-options'));
    });
  });

})(window, jQuery);
