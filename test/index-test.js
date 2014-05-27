var simple = require('../');

describe('Simple IOC', function () {
  var ioc;

  beforeEach(function () {
    ioc = simple(__dirname + '/fixtures/r1');
  });

  it('should create instance of injected', function (done) {
    function check(err, inst) {
      if (err) return done(err);
      inst.answer().should.equal(42);
      done();
    }
    ioc.get('./m3', check);
  });
});
