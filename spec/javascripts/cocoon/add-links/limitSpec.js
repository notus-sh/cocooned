describe('With a limit', function () {
  describe('and a basic setup', function () {

    beforeEach(function() {
      $(templates['add-links-limit-basic']).appendTo('body');
      this.subject = $('.nested-form');
    });

    afterEach(function(){
      $('#form-template').remove()
    });

    describe('too much clicks on the association add link', shouldHonoreTheLimit(true));
  });

  describe('and appropriate association insertion node and method', function () {

    beforeEach(function() {
      $(templates['add-links-limit-valid']).appendTo('body');
      this.subject = $('.nested-form');
    });

    afterEach(function(){
      $('#form-template').remove()
    });

    describe('too much clicks on the association add link', shouldHonoreTheLimit(false));
  });
});
