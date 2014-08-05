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
}

/**
 * Recursively resolve the package by its path,
 * along with all of its $inject(ed) dependencies.
 *
 * @param {String} path
 * @returns {Array} of packages, starting at the leafs
 */

Resolver.prototype.resolve = function resolve(path) {
  var filename, dirname, factory, package, deps;

  try {
    filename = resolveFilename(path, arguments[1] || this._basedir);
    factory = require(filename);
  } catch (e) {
    rethrow(e, 'Cannot resolve "%s"', path);
  }

  dirname = getDirname(filename);
  package = new Package(filename, factory);
  if (!package.hasDependencies) return [package];

  try {
    package.injectedPaths = resolveFilenames(
      package.injectedPaths, dirname);
  } catch (e) {
    rethrow(e, 'Cannot resolve dependency of "%s"', package.path);
  }

  deps = package.injectedPaths.map(function (injectedPath) {
    var dep;
    try {
      dep = resolve(injectedPath, dirname);
    } catch (e) {
      rethrow(e, 'Cannot inject dependency of "%s"', package.path);
    }
    return dep;
  });

  deps.push(package);
  return util.flattenArray(deps);
};
