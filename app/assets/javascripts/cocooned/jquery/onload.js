;(function(w, $) {
  'use strict';

  $(function() {
    $('*[data-cocooned-options]').each(function(i, el) {
      $(el).cocooned($(el).data('cocooned-options'));
    });
  });

})(window, jQuery);
