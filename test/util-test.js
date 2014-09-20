var util = require('../lib/util');

describe('util', function () {
  describe('rethrow', function () {
    it('should rethrow n error with a message', function () {
      (function () {
        var deepError = new Error('deep');
        util.rethrow(deepError, 'top %s', 'level');
      }).should.throw('top level. deep');
    });
  });

  describe('flattenArray', function () {
    it('should flatten an array', function () {
      util.flattenArray(['a', ['b'], 'c'])
        .should.eql(['a', 'b', 'c']);
    });
  });
});
