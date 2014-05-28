var Instantiator = require('../lib/instantiator'),
  Package = require('../lib/package'),
  stub = require('sinon').stub;

describe('Instantiator', function () {
  var unit, resolver;

  beforeEach(function () {
    function noop() {}
    resolver = stub({resolve: noop});
    unit = new Instantiator(resolver);
  });

  it('should create instance without deps', function (done) {
    function check(err, instance) {
      if (err) return done(err);
      instance.answer.should.equal(42);
      done();
    }

    resolver.resolve.yields(null, [
      new Package('a', function () { this.answer = 42; })
    ]);

    unit.get('a', check);
  });

  it('should create instance with deps', function (done) {
    var pkgA, pkgB;

    function check(err, instance) {
      if (err) return done(err);
      instance.fav.should.equal(7);
      done();
    }

    function B() { this.fav = 7; }
    function A(b) { this.fav = b.fav; }
    A.$inject = ['b'];

    pkgB = new Package('b', B);
    pkgA = new Package('a', A);

    pkgA.dependencyPaths = ['b'];

    resolver.resolve.yields(null, [pkgB, pkgA]);
    unit.get('a', check);
  });
});
