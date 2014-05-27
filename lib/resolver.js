var util = require('./util'),
  Package = require('./package');

module.exports = Resolver;

/**
 * Responsibility:
 *   To identify the dependencies of
 *   a module and return them, as well
 *   as the module in a list,
 *   starting with the oldest parent,
 *   and ending with the dependency
 *   itself.
 *
 * Reason:
 *   This eliminates need to locate
 *   dependencies at runtime; thereby
 *   improving performance.
 */

function Resolver(rootPath) {
  this.rootModule = util.createRootModule(rootPath);
}

Resolver.prototype.resolve = function (path, parent, cb) {
  var self, isDone, module, factory, package, deps;

  if (!cb) {
    cb = parent;
    parent = this.rootModule;
  }

  self = this;
  try { factory = parent.require(path); }
  catch (err) { return cb(err); }
  module = util.createModule(path, parent);
  package = new Package(module.filename, factory);

  if (!Array.isArray(factory.$inject)) {
    return cb(null, [package]);
  }

  isDone = false;
  deps = [];

  function addDep(err, dep) {
    if (isDone) return;
    if (err) {
      err.message = 'failed to inject dependency of "' +
        path + '": ' + err.message;
      return done(err);
    }
    deps.push(dep);
    if (deps.length === factory.$inject.length) done(null);
  }

  function done(err) {
    var merged = [];
    isDone = true;
    if (err) return cb(err);
    deps.push(package);
    merged = merged.concat.apply(merged, deps);
    cb(null, merged);
  }

  factory.$inject.forEach(function (path) {
    self.resolve(path, module, addDep);
  });
};
