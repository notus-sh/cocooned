const jQuery = require('jquery');
const { delegate, abnegate } = require('jquery-events-to-dom-events');

// Change jQuery handler for the document ready event to immediately executed callbacks.
jQuery.fn.ready = function(fn) {
  if(fn) fn();
}

if (typeof global !== 'undefined') {
  global.$ = global.jQuery = jQuery;
  global.delegate = delegate;
  global.abnegate = abnegate;
}

if (typeof window !== 'undefined') {
  // jQuery needs to be available as window.$ for jquery-events-to-dom-events functions to work.
  window.$ = jQuery;
}
