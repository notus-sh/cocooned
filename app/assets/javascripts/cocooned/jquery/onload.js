;(function(w, $) {
  'use strict';

  $(function() {
    $('*[data-cocooned-options]').each(function(el) {
      $(el).cocooned($(el).data('cocooned-options'));
    });
  });

})(window, jQuery);
