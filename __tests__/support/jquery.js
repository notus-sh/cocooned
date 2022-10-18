const $ = require('jquery');
const { delegate, abnegate } = require('jquery-events-to-dom-events');

if (typeof global !== 'undefined') {
  global.$ = global.jQuery = $;
  global.delegate = delegate;
  global.abnegate = abnegate;
}

if (typeof window !== 'undefined') {
  // jQuery needs to be available as window.$ for jquery-events-to-dom-events functions to work.
  window.$ = $;
}
