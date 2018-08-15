//= require jquery
//= require cocoon
// Jasmine setup
/* globals beforeAll */
//= require 'jasmine-core/jasmine'
//= require 'jasmine-core/json2'
//= require 'jasmine-core/jasmine-html'
//= require 'jasmine-core/boot'
//= require_tree './../../../../javascripts/helpers/shared_examples'
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

    var form = $('#form-template-' + templateName);
    if (form.length === 0) {
      return;
    }

    var regexp = new RegExp('id="form-template-' + templateName + '"');
    templates[templateName] = form.get(0).outerHTML.replace(regexp, 'id="form-template"');
    form.remove();
  });
});
