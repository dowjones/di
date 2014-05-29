var ioc = require('../');

describe('IOC', function () {
  var unit;

  beforeEach(function () {
    unit = ioc(__dirname + '/fixtures/r1');
  });

  it('should create instance of injected', function (done) {
    function check(err, inst) {
      if (err) return done(err);
      inst.answer().should.equal(42);
      done();
    }
    unit.create('./m1', check);
  });

  it('should create module with common', function (done) {
    function check(err, inst) {
      if (err) return done(err);
      inst.get().should.equal('MOD-DEEP-OTHER-COMMON');
      done();
    }
    unit.create('./mod_with_common', check);
  });

  it('should create common directly', function (done) {
    function check(err, inst) {
      if (err) return done(err);
      inst.get().should.equal('DEEP-OTHER-COMMON');
      done();
    }
    unit.create('common', check);
  });
});
