var util = require('./util'),
  rethrow = util.rethrow,
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

Resolver.prototype.resolve = function (path, parent) {
  var self, module, factory, package, deps, i, l;

  self = this;
  parent = parent || this.rootModule;

  try {
    module = util.createModule(path, parent);
    factory = parent.require(path);
  } catch (e) {
    rethrow(e, 'resolving "%s"', path);
  }

  package = new Package(module.filename, factory);
  if (!package.hasDependencies) return [package];

  try {
    package.injectedPaths = util.resolveFilenames(
      package.injectedPaths, module);
  } catch (e) {
    rethrow(e, 'resolving dependency of "%s"', package.path);
  }

  deps = package.injectedPaths.map(function (injectedPath) {
    var dep;
    try {
      dep = self.resolve(injectedPath, module);
    } catch (e) {
      rethrow(e, 'injecting dependency of "%s"', package.path);
    }
    return dep;
  });

  deps.push(package);
  return util.flattenArray(deps);
};
