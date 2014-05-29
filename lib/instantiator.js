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

Instantiator.prototype.create = function (path, cb) {
  var cache = this._cache;

  function instantiateAll(err, packages) {
    var instances;
    if (err) return cb(err);

    try { instances = packages.map(instantiateOne); }
    catch (e) { return cb(e); }

    cb(null, instances.pop());
  }

  function instantiateOne(package) {
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

  this._resolver.resolve(path, instantiateAll);
};
