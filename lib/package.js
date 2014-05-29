module.exports = Package;

function Package(path, factory) {
  this.path = path;
  this.factory = factory;
  this.injectedPaths = factory.$inject || [];
  this.isFactoryFunction = ('function' === typeof factory);
  this.hasDependencies = Array.isArray(factory.$inject);
}
