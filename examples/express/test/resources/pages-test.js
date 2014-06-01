var PagesResource = require('../../resources/pages'),
  stubs = require('../stubs');

describe('PagesResource', function () {
  var unit, req, res, router;

  beforeEach(function () {
    req = stubs.request();
    res = stubs.response();
    router = stubs.router();
    unit = new PagesResource();
  });

  it('should route', function () {
    unit.route(router);
  });

  describe('render', function () {
    it('should render page', function () {
      req.params = {pageId: 'p'};
      unit.render(req, res);
      res.render.withArgs('p').calledOnce.should.be.ok;
    });

    it('should render home-page when path is /', function () {
      req.params = {pageId: ''};
      unit.render(req, res);
      res.render.withArgs('home').calledOnce.should.be.ok;
    });

    it('should call next on invalid pageId', function (done) {
      req.params = {pageId: '.'};
      unit.render(req, res, done);
    });
  });

  describe('error', function () {
    it('should return next on non-view error', function (done) {
      function check(err) {
        err.message.should.equal('e');
        done();
      }
      unit.error(new Error('e'), req, res, check);
    });

    it('should render 404 page on view error', function () {
      var viewErr = {view: {path: null}};
      unit.error(viewErr, req, res);
      res.status.withArgs(404).calledOnce.should.be.ok;
      res.render.withArgs('404').calledOnce.should.be.ok;
    });
  });
});
