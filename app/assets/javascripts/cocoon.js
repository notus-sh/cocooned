/* globals Cocooned */
//= require 'cocooned'

// Compatibility with the original Cocoon
// TODO: Remove in 3.0
function initCocoon () {
  $(Cocooned.prototype.selector('add')).each(function (_i, adder) {
    const container = Cocooned.prototype.findContainer(adder)
    const limit = parseInt(adder.dataset?.limit, 10) || false

    $(container).cocooned({ limit })
  })
}

$(initCocoon)
