var Instantiator = require('../lib/instantiator'),
  Package = require('../lib/package'),
  stub = require('sinon').stub;

describe('Instantiator', function () {
  var unit, resolver;

  beforeEach(function () {
    function noop() {}
    resolver = stub({provide: noop, resolve: noop});
    unit = new Instantiator(resolver);
  });

  it('should create instance without deps', function () {
    function Factory () { this.answer = 42; }
    Factory.$inject = [];

    resolver.resolve.returns([
      new Package('a', Factory)
    ]);

    var instance = unit.create('a');
    instance.answer.should.equal(42);
  });

  it('should create instance with deps', function () {
    var pkgA, pkgB, instance;

    function B() { this.fav = 7; }
    B.$inject = [];

    function A(b) { this.fav = b.fav; }
    A.$inject = ['b'];

    pkgB = new Package('b', B);
    pkgA = new Package('a', A);

    pkgA.injectedPaths = ['b'];

    resolver.resolve.returns([pkgB, pkgA]);
    instance = unit.create('a');
    instance.fav.should.equal(7);
  });

  it('should allow providing pre-resolved packages', function () {
    unit.provide({a: 4});
    resolver.provide.calledOnce.should.be.ok;
  });
});
