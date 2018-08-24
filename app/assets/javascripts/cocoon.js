/* globals Cocooned */
//= require 'cocooned'

// Compatibility with the original Cocoon
// TODO: Remove in 2.0
function initCocoon () {
  $(Cocooned.prototype.selector('add')).each(function (_i, addLink) {
    var container = Cocooned.prototype.findContainer(addLink);
    var limit = parseInt($(addLink).data('limit'), 10) || false;

    container.cocooned({ limit: limit });
  });
}

$(initCocoon);
