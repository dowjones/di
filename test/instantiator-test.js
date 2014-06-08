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

  it('should create instance without deps', function () {
    resolver.resolve.returns([
      new Package('a', function () { this.answer = 42; })
    ]);

    var instance = unit.create('a');
    instance.answer.should.equal(42);
  });

  it('should create instance with deps', function () {
    var pkgA, pkgB, instance;

    function B() { this.fav = 7; }
    function A(b) { this.fav = b.fav; }
    A.$inject = ['b'];

    pkgB = new Package('b', B);
    pkgA = new Package('a', A);

    pkgA.injectedPaths = ['b'];

    resolver.resolve.returns([pkgB, pkgA]);
    instance = unit.create('a');
    instance.fav.should.equal(7);
  });
});
