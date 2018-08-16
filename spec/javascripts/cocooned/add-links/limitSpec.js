/* globals jasmine, describe, it, beforeEach, afterEach, expect, templates */

describe('With a limit', function () {
  describe('and a basic setup', function () {

    beforeEach(setup('add-links-limit-basic'));
    afterEach(teardown());

    describe('too much clicks on the association add link', shouldHonoreTheLimit(false));
  });

  describe('and appropriate association insertion node and method', function () {

    beforeEach(setup('add-links-limit-valid'));
    afterEach(teardown());

    describe('too much clicks on the association add link', shouldHonoreTheLimit(false));
  });
});
