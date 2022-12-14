/* globals Cocooned */
//= require 'cocooned'

// Compatibility with the original Cocoon
// TODO: Remove in 3.0
function initCocoon () {
  $(Cocooned.prototype.selector('add')).each(function (_i, addLink) {
    const container = Cocooned.prototype.findContainer(addLink)
    const limit = parseInt($(addLink).data('limit'), 10) || false

    container.cocooned({ limit })
  })
}

$(initCocoon)
