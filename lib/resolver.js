var getDirname = require('path').dirname,
  Package = require('./package'),
  util = require('./util'),
  resolveFilename = util.resolveFilename,
  resolveFilenames = util.resolveFilenames,
  rethrow = util.rethrow;

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
  this._basedir = rootPath;
  this._provided = {};
  this._cache = {};
}

/**
 * Provide pre-resolved packages
 *
 * @param {Object} packages
 */

Resolver.prototype.provide = function (packages) {
  var provided = this._provided;
  Object.keys(packages).forEach(function (key) {
    provided[key] = packages[key];
  });
};

/**
 * Recursively resolve the package by its path,
 * along with all of its $inject(ed) dependencies.
 *
 * @param {String} path
 * @returns {Array} of packages, starting at the leafs
 */

Resolver.prototype.resolve = function (path) {
  var cached, fresh;

  cached = this._cache[path];
  if (cached) return cached;

  fresh = this._resolve(path);
  this._cache[path] = fresh;

  return fresh;
};

Resolver.prototype._resolve = function (path) {
  var filename, cached, dirname, factory,
    pkg, deps, provided;

  provided = this._provided[path];
  if (provided) return [new Package(path, provided)];

  try {
    filename = resolveFilename(path, arguments[1] || this._basedir);
    factory = require(filename);
  } catch (e) {
    rethrow(e, 'Cannot resolve "%s"', path);
  }

  dirname = getDirname(filename);
  pkg = new Package(filename, factory);
  if (!pkg.hasDependencies) return [pkg];

  deps = pkg.injectedPaths.map(function (injectedPath, i, paths) {
    var dep;
    try {
      dep = this._resolve(injectedPath, dirname);
    } catch (e) {
      rethrow(e, 'Cannot inject dependency of "%s"', pkg.path);
    }
    // replace relative path with resolved abs. path
    paths[i] = dep[dep.length - 1].path;
    return dep;
  }, this);

  deps.push(pkg);
  return util.flattenArray(deps);
};
