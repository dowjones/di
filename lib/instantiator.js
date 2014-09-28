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
  var packages = this._resolver.resolve(path);
  return packages.map(this._instantiate, this).pop();
};

Instantiator.prototype._instantiate = function (package) {
  var deps, factory, instance;

  deps = package.injectedPaths.map(this._getFromCache, this);
  factory = package.factory;
  instance = factory;

  if (package.isFactoryFunction) {
    instance = Object.create(factory.prototype);
    factory.apply(instance, deps);
  }

  this._cache[package.path] = instance;
  return instance;
};

Instantiator.prototype._getFromCache = function (path) {
  return this._cache[path];
};
