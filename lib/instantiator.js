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

Instantiator.prototype.create = function (path) {
  var cache = this._cache;

  function create(packages) {
    return packages.map(instantiate).pop();
  }

  function instantiate(package) {
    var args, factory, instance;

    args = package.injectedPaths.map(fromCache);
    factory = package.factory;
    instance = factory;

    if (package.isFactoryFunction) {
      instance = Object.create(factory.prototype);
      factory.apply(instance, args);
    }

    cache[package.path] = instance;
    return instance;
  }

  function fromCache(path) {
    return cache[path];
  }

  return create(
    this._resolver.resolve(path));
};
