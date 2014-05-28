module.exports = Instantiator;

function Instantiator(resolver) {
  this._resolver = resolver;
  this._cache = {};
}

Instantiator.prototype.get = function (path, cb) {
  var cache = this._cache;

  function instantiateAll(err, packages) {
    var instances;
    if (err) return cb(err);

    try { instances = packages.map(instantiateOne); }
    catch (e) { return cb(e); }

    cb(null, instances.pop());
  }

  function instantiateOne(package) {
    var args, module, instance;

    args = package.dependencyPaths.map(fromCache);
    module = package.module;
    instance = module;

    if (package.isFunction) {
      instance = Object.create(module.prototype);
      module.apply(instance, args);
    }

    cache[package.path] = instance;
    return instance;
  }

  function fromCache(path) {
    return cache[path];
  }

  this._resolver.resolve(path, instantiateAll);
};
