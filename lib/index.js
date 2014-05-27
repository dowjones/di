var join = require('path').join;

module.exports = Simple;

function Simple(root) {
  if (!(this instanceof Simple)) {
    return new Simple(root);
  }
  this.root = root;
}

Simple.prototype.get = function (name, cb) {
  var path, module, instance;

  path = join(this.root, name);

  try { module = require(path); }
  catch (e) { return cb(e); }

  if ('function' === typeof module) {
    instance = new module();
  }

  process.nextTick(function () {
    cb(null, instance);
  });
};
