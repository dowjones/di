var Resolver = require('./resolver'),
  Instantiator = require('./instantiator');

module.exports = function create(rootPath) {
  var resolver, instantiator;
  resolver = new Resolver(rootPath);
  instantiator = new Instantiator(resolver);
  return instantiator;
};
