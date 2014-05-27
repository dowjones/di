var should = require('should'),
  Crawler = require('../lib/crawler'),
  Package = require('../lib/package');

Error.stackTraceLimit = 3;

describe('Crawler', function () {
  var unit;

  beforeEach(function () {
    unit = new Crawler(__dirname + '/fixtures/r1');
  });

  it('should find leaf', function (done) {
    function check(err, list) {
      if (err) return done(err);
      should.exist(list);
      list.length.should.equal(1);
      list[0].should.be.an.instanceOf(Package);
      list[0].path.should.match(/m3\/index.js/);
      done();
    }
    unit.crawl('./m3', check);
  });

  it('should find a parent / leaf combo', function (done) {
    function check(err, list) {
      if (err) return done(err);
      should.exist(list);
      list.length.should.equal(3);
      list[0].path.should.match(/m3\/index.js/);
      list[1].path.should.match(/m2\/index.js/);
      list[2].path.should.match(/m1\/index.js/);
      done();
    }
    unit.crawl('./m1', check);
  });

  it('should require common from node_modules', function (done) {
    function check(err, list) {
      if (err) return done(err);
      should.exist(list);
      list.length.should.equal(4);
      list[0].path.should.match(/common\/other.js/);
      list[1].path.should.match(/deep\/index.js/);
      list[2].path.should.match(/common\/index.js/);
      list[3].path.should.match(/mod_with_common\/index.js/);
      done();
    }
    unit.crawl('./mod_with_common', check);
  });
});

