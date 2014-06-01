var UserService = require('../../services/user');

describe('UserService', function () {
  var unit;

  beforeEach(function () {
    unit = new UserService();
  });

  it('should list users', function (done) {
    function check(err, users) {
      if (err) return done(err);
      users.length.should.be.greaterThan(0);
      done();
    }
    unit.list(check);
  });
});
