/* globals Cocooned */
//= require 'cocooned'

// Compatibility with the original Cocoon
function initCocoon () {
  $(Cocooned.prototype.addLinkSelector).each(function (_i, addLink) {
    var container = Cocooned.prototype.findContainer(addLink);
    var limit = parseInt($(addLink).data('limit'), 10) || false;

    container.cocooned({ limit: limit });
  });
}

$(initCocoon);
