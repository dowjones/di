var join = require('path').join,
  Module = require('module'),
  Package = require('./package');

module.exports = Crawler;

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

function Crawler(rootPath) {
  this.rootModule = createRootModule(rootPath);
}

Crawler.prototype.crawl = function (path, parent, cb) {
  var self, isDone, module, factory, package, deps;

  if (!cb) {
    cb = parent;
    parent = this.rootModule;
  }

  self = this;
  try { factory = parent.require(path); }
  catch (err) { return cb(err); }
  module = createModule(path, parent);
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
    self.crawl(path, module, addDep);
  });
};

function createRootModule(rootPath) {
  var fakeFilename = join(rootPath, 'index.js'),
    module = new Module(fakeFilename);
  module.filename = fakeFilename;
  module.paths = nodeModulePaths(rootPath);
  return module;
}

function createModule(name, parent) {
  var filename = resolveFilename(name, parent),
    module = new Module(filename, parent);
  module.load(filename);
  return module;
}


// Using private methods is of-course horrible.
// The only alternative I'm aware of is to
// re-implement (or copy) both.

function resolveFilename(name, parent) {
  return Module._resolveFilename(name, parent);
}

function nodeModulePaths(dir) {
  return Module._nodeModulePaths(dir);
}
