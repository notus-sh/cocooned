// Jasmine setup
//= require 'jasmine-core/jasmine'
//= require 'jasmine-core/json2'
//= require 'jasmine-core/jasmine-html'
//= require 'jasmine-core/boot'
//= require_tree './../../../../javascripts/helpers/shared_examples'
//= require 'helpers/setup'
// Templates capture
//= require_self
// Test suites
//= require 'cocoon/basicSpec'
//= require 'cocoon/remove-links/wrapperClassSpec'
//= require 'cocoon/add-links/associationInsertionMethodSpec'
//= require 'cocoon/add-links/associationInsertionNodeSpec'
//= require 'cocoon/add-links/associationInsertionTraversalSpec'
//= require 'cocoon/add-links/countSpec'
//= require 'cocoon/add-links/limitSpec'

var templates = {};


beforeAll(function () {
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

    var template = document.querySelector('#template-' + templateName);
    if (template) {
      templates[templateName] = template.innerHTML;
    }
  });
});
