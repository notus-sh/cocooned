// Jasmine setup
/* globals beforeAll */
//= require 'jasmine-core/jasmine'
//= require 'jasmine-core/json2'
//= require 'jasmine-core/jasmine-html'
//= require 'jasmine-core/boot'
//= require_tree './../../../../javascripts/helpers/shared_examples'
//= require 'helpers/setup'
// Templates capture
//= require_self
// Test suites
//= require 'cocooned/basicSpec'
//= require 'cocooned/add-links/associationInsertionMethodSpec'
//= require 'cocooned/add-links/associationInsertionNodeSpec'
//= require 'cocooned/add-links/associationInsertionTraversalSpec'
//= require 'cocooned/add-links/countSpec'
//= require 'cocooned/add-links/limitSpec'
//= require 'cocooned/reorderableSpec'

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
    'add-links-limit-valid',
    'reorderable'
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
