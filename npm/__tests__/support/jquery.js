import jQuery from 'jquery'

// Change jQuery handler for the document ready event to immediately executed callbacks.
jQuery.fn.ready = function (fn) {
  if (fn) fn()
}

if (typeof global !== 'undefined') {
  global.$ = global.jQuery = jQuery
}

if (typeof window !== 'undefined') {
  // jQuery needs to be available as window.$ for jquery-events-to-dom-events functions to work.
  window.$ = jQuery
}
