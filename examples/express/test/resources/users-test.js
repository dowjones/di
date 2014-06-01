var UsersResource = require('../../resources/users'),
  stubs = require('../stubs');

describe('UsersResource', function () {
  var unit, userSvc, req, res, router;

  beforeEach(function () {
    userSvc = stubs.userService();
    req = stubs.request();
    res = stubs.response();
    router = stubs.router();
    unit = new UsersResource(userSvc);
  });

  it('should route', function () {
    unit.route(router);
  });

  describe('list', function () {
    it('should get users and respond to client', function () {
      userSvc.list.yields(null);
      unit.list(req, res);
      userSvc.list.calledOnce.should.be.ok;
      res.json.calledOnce.should.be.ok;
    });

    it('should return next on error', function (done) {
      userSvc.list.yields(new Error('e'));
      function check(err) {
        err.message.should.equal('e');
        done();
      }
      unit.list(req, res, check);
    });
  });
});
