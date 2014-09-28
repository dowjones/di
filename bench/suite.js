var Benchmark = require('benchmark'),
  suite = new Benchmark.Suite(),
  assert = require('assert'),
  di = require('../')(__dirname + '/fixtures');

// for vanilla bench
var A = require('./fixtures/a'),
  B = require('./fixtures/b'),
  C = require('./fixtures/c');

console.log('Running benchmark suite...');

// Vanilla will, of course, be faster.
// The point is to get DI as close as possible to it.

suite
.add('Vanilla', function() {
  var a, b, c;

  c = Object.create(C.prototype);
  C.apply(c, []);

  b = Object.create(B.prototype);
  B.apply(b, [c]);

  a = Object.create(A.prototype);
  A.apply(a, [b]);

  assert.equal(42, a.b.c.answer());
})
.add('DI', function() {
  var a = di.create('./a');
  assert.equal(42, a.b.c.answer());
})

.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  var fastest = this.filter('fastest')[0],
    slowest = this.filter('slowest')[0];
  console.log('ok');
})

.run({'async': true});
