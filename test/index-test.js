var DI = require('../');

describe('DI', function () {
  var unit;

  beforeEach(function () {
    unit = DI(__dirname + '/fixtures/r1');
  });

  it('should create an instance with an empty inject', function () {
    var inst = unit.create('./empty_inject');
    inst.answer().should.equal(42);
  });

  it('should create instance of injected', function () {
    var inst = unit.create('./m1');
    inst.answer().should.equal(42);
  });

  it('should create module with common', function () {
    var inst = unit.create('./mod_with_common');
    inst.get().should.equal('MOD-DEEP-OTHER-COMMON');
  });

  it('should create common directly', function () {
    var inst = unit.create('common');
    inst.get().should.equal('DEEP-OTHER-COMMON');
  });

  it('should create with core node module', function () {
    var inst = unit.create('./mod_with_core');
    inst.isOk().should.be.ok;
  });
});
