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
  var self, module, factory, package, isDone, deps;

  if (!cb) {
    cb = parent;
    parent = this.rootModule;
  }

  self = this;

  try {
    module = util.createModule(path, parent);
    factory = parent.require(path);
  } catch (e) {
    e.message = 'resolving "' + path + '": ' + e.message;
    return cb(e);
  }

  package = new Package(module.filename, factory);

  if (!package.hasDependencies) {
    return cb(null, [package]);
  }

  try {
    package.injectedPaths = resolvePaths(package.injectedPaths, module);
  } catch (e) {
    e.message = 'resolving dependency of "' +
      package.path + '": ' + e.message;
    return cb(e);
  }

  isDone = false;
  deps = [];

  function addDep(err, dep) {
    if (isDone) return;
    if (err) {
      err.message = 'injecting dependency of "' +
        package.path + '": ' + err.message;
      return done(err);
    }
    deps.push(dep);
    if (deps.length === package.injectedPaths.length) done(null);
  }

  function done(err) {
    var merged = [];
    isDone = true;
    if (err) return cb(err);
    deps.push(package);
    merged = merged.concat.apply(merged, deps);
    cb(null, merged);
  }

  package.injectedPaths.forEach(function (path) {
    self.resolve(path, module, addDep);
  });
};

function resolvePaths(paths, parent) {
  function resolve(path) {
    return util.resolveFilename(path, parent);
  }
  return paths.map(resolve);
}
