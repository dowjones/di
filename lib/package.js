module.exports = Package;

function Package(path, module) {
  this.path = path;
  this.module = module;
  this.dependencyPaths = [];
  this.isFunction = ('function' === typeof module);
}
