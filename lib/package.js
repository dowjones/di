module.exports = Package;

function Package(path, factory) {
  this.path = path;
  this.factory = factory;
  this.injectedPaths = [];
  if (Array.isArray(factory.$inject)) {
    this.injectedPaths = factory.$inject;
    this.isFactoryFunction =  ('function' === typeof factory);
    this.hasDependencies = !!factory.$inject.length;
  }
}
