/* globals Cocoon */
//= require 'cocoon-core'
//= require 'cocoon/jquery/plugin'
//= require 'cocoon/jquery/onload'

// Compatibility with the original Cocoon
function initCocoon () {
  $(Cocoon.prototype.addLinkSelector).each(function (_i, addLink) {
    var container = Cocoon.prototype.findContainer(addLink);
    var limit = parseInt($(addLink).data('limit'), 10) || false;

    container.cocoon({ limit: limit });
  });
}

$(initCocoon);
