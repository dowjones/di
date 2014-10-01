module.exports = Package;

function Package(path, factory) {
  this.path = path;
  this.factory = factory;
  this.injectedPaths = factory.$inject || [];
  this.isFactoryFunction = Array.isArray(factory.$inject) &&
    ('function' === typeof factory);
  this.hasDependencies = Array.isArray(factory.$inject) &&
    factory.$inject.length;
}
