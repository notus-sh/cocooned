// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require jquery
//= require cocoon

//= require 'jasmine-core/jasmine'
//= require 'jasmine-core/json2'
//= require 'jasmine-core/jasmine-html'
//= require 'jasmine-core/boot'

//= require_tree './../../../../javascripts/helpers/shared_examples'

//= require_self

//= require 'cocoon/basicSpec'
//= require 'cocoon/remove-links/wrapperClassSpec'
//= require 'cocoon/add-links/associationInsertionMethodSpec'
//= require 'cocoon/add-links/associationInsertionNodeSpec'
//= require 'cocoon/add-links/associationInsertionTraversalSpec'
//= require 'cocoon/add-links/countSpec'
//= require 'cocoon/add-links/limitSpec'

var templates = {};

beforeAll(function() {
  var templateNames = [
    'basic',
    'remove-links-wrapper-class',
    'add-links-association-insertion-method',
    'add-links-association-insertion-node',
    'add-links-association-insertion-traversal',
    'add-links-count',
    'add-links-limit-basic',
    'add-links-limit-valid'
  ];

  templateNames.forEach(function (templateName) {
    if (templates.hasOwnProperty(templateName)) {
      return;
    }

    var form = $('#form-template-' + templateName);
    if (form.length === 0) {
      return;
    }

    var regexp = new RegExp('id="form-template-' + templateName + '"')
    templates[templateName] = form.get(0).outerHTML.replace(regexp, 'id="form-template"');
    form.remove();
  });
});
