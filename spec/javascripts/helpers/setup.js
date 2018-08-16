function setup(templateName) {
  return function () {
    if (!templates.hasOwnProperty(templateName)) {
      console.warn('Empty template:' + templateName);
    }
    $(templates[templateName]).appendTo('body');
    this.wrapper = $('.nested-form');
    initCocoon();
  };
}

function teardown() {
  return function () {
    $('#form-template').detach();
  };
}
