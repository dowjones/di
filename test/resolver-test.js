var should = require('should'),
  Resolver = require('../lib/resolver'),
  Package = require('../lib/package');

describe('Resolver', function () {
  var unit;

  beforeEach(function () {
    unit = new Resolver(__dirname + '/fixtures/r1');
  });

  it('should find leaf', function () {
    var list = unit.resolve('./m3');
    should.exist(list);
    list.length.should.equal(1);
    list[0].should.be.an.instanceOf(Package);
    list[0].path.should.match(/m3\/index.js/);
  });

  it('should find a parent / leaf combo', function () {
    var list = unit.resolve('./m1');
    should.exist(list);
    list.length.should.equal(3);
    list[0].path.should.match(/m3\/index.js/);
    list[1].path.should.match(/m2\/index.js/);
    list[2].path.should.match(/m1\/index.js/);
  });

  it('should require common from node_modules', function () {
    var list = unit.resolve('./mod_with_common');
    should.exist(list);
    list.length.should.equal(4);
    list[0].path.should.match(/common\/other.js/);
    list[1].path.should.match(/deep\/index.js/);
    list[2].path.should.match(/common\/index.js/);
    list[3].path.should.match(/mod_with_common\/index.js/);
  });

  it('should require a core node module', function () {
    var list = unit.resolve('./mod_with_core');
    list.length.should.equal(2);
    should.exist(list[0].path);
  });

  describe('provide', function () {
    it('should allow providing pre-resolved packages', function () {
      unit.provide({a: '7'});
      var list = unit.resolve('a');
      list.length.should.equal(1);
      list[0].factory.should.equal('7');
    });

    it('should allow provided classes to $inject', function () {
      function Foo(a) { this.a = a; }
      Foo.$inject = ['a'];
      unit.provide({
        foo: Foo,
        a: 7
      });
      var list = unit.resolve('foo');
      list.length.should.equal(2);
      list[0].factory.should.equal(7);
      list[1].factory.$inject.should.eql(['a']);
    });
  });
});
