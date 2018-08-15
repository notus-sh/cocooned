//= require 'cocoon-core'
//= require 'cocoon/jquery/plugin'
//= require 'cocoon/jquery/onload'

// Compatibility with the original Cocoon
function initCocoon() {
  $(Cocoon.prototype.addLinkSelector).each(function(_i, addLink) {
    var container = Cocoon.prototype.findContainer.apply(Cocoon.prototype, [addLink]);
    container.cocoon($(container).data('cocoon-options'));
  });
}

$(initCocoon);
