module.exports = Instantiator;

/**
 * Responsibility:
 *   To create instances from packages
 *   created by the resolver.
 */

function Instantiator(resolver) {
  this._resolver = resolver;
  this._cache = {};
}

/**
 * Provide pre-resolved packages
 *
 * @param {Object} packages
 */

Instantiator.prototype.provide = function (packages) {
  this._resolver.provide(packages);
};

Instantiator.prototype.create = function (path) {
  var packages, instances, pkg, instance,
    deps, factory, i, l, j, m;

  packages = this._resolver.resolve(path);
  instances = [];

  for (i = 0, l = packages.length; i < l; i++) {
    pkg = packages[i];
    instance = pkg.factory;

    if (pkg.isFactoryFunction) {
      deps = [];
      for (j = 0, m = pkg.injectedPaths.length; j < m; j++) {
        deps[j] = this._cache[pkg.injectedPaths[j]];
      }
      factory = instance;
      instance = Object.create(instance.prototype);
      factory.apply(instance, deps);
    }

    this._cache[pkg.path] = instance;
    instances[i] = instance;
  }

  return instances[instances.length - 1];
};
