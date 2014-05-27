module.exports = Package;

function Package(path, module) {
  this.path = path;
  this.module = module;
  this._isFunction = ('function' === typeof module);
}

Package.prototype.create = function () {
  return (this._isFunction) ?
    Object.create(this.module.prototype, this.module) :
    this.module;
};
