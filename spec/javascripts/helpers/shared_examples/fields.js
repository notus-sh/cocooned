function nestedFieldNameRegexp (pseudoIdPattern, namePattern) {
  return new RegExp('^list\\[items_attributes\\]\\[(' + pseudoIdPattern + ')\\]\\[(' + namePattern + ')\\]$');
}

function nestedFieldIdRegexp (pseudoIdPattern, namePattern) {
  return new RegExp('^list_items_attributes_(' + pseudoIdPattern + ')_(' + namePattern + ')$');
}

function shouldBeCorrectlyNamed (pseudoIdPattern) {
  return function () {
    var nameRegExp = function (name) {
      return nestedFieldNameRegexp(pseudoIdPattern, name);
    };
    var idRegExp = function (name) {
      nestedFieldIdRegexp(pseudoIdPattern, name);
    };

    it("should have correct names and ids", function () {
      expect(this.subject.find('input[type="hidden"]').filter(function () {
        return this.name.match(nameRegExp('_destroy')) && this.id.match(idRegExp('_destroy'));
      }).length).toEqual(1);

      expect(this.subject.find('input[type="hidden"]').filter(function () {
        return this.name.match(nameRegExp('position')) && this.id.match(idRegExp('position'));
      }).length).toEqual(1);

      expect(this.subject.find('input[type="text"]').filter(function () {
        return this.name.match(nameRegExp('label')) && this.id.match(idRegExp('label'));
      }).length).toEqual(1);

      expect(this.subject.find('label').filter(function () {
        return this.getAttribute('for').match(idRegExp('label'));
      }).length).toEqual(1);
    });

    it("should share the same pseudo-id", function () {
      var pseudoIds = new Set(this.subject.find('input').map(function (i, input) {
        var matches = nameRegExp('.+').exec(input.getAttribute('name'));
        return matches[1];
      }).get());

      expect(pseudoIds.size).toEqual(1);
    });
  };
}
