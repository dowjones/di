var path = require('path'),
  Module = require('module'),
  format = require('util').format;

/**
 * Responsibility:
 *   To resolve a path of a module.
 *
 * Using the core Module module (ehem)
 * in order not to re-implement the functionality.
 */

exports.createRootModule = function (rootPath) {
  var fakeFilename = path.join(rootPath, 'index.js'),
    module = new Module(fakeFilename);
  module.filename = fakeFilename;
  module.paths = nodeModulePaths(rootPath);
  return module;
};

exports.createModule = function (name, parent) {
  var filename = resolveFilename(name, parent),
    module = new Module(filename, parent),
    isFilenamePath = (filename.indexOf(path.sep) > -1),
    isCoreNodeModule = (!isFilenamePath && (filename === name));
  if (isCoreNodeModule) {
    module.filename = name;
    return module;
  }
  module.load(filename);
  return module;
};

exports.resolveFilename = function (name, parent) {
  return resolveFilename(name, parent);
};

exports.resolveFilenames = function (names, parent) {
  function resolve(name) {
    return exports.resolveFilename(name, parent);
  }
  return names.map(resolve);
};

exports.rethrow = function (err, msg /*, ...*/) {
  var args = [].slice.call(arguments);
  err = args.shift();
  err.message = format.apply(null, args);
  throw err;
};

exports.flattenArray = function (array) {
  return [].concat.apply([], array);
};

//  WARNING: Using private core methods.
//
//  This is horrible. Please suggest another way to resolve
//  filenames in the same way that require() resolves them,
//  and getting node's module paths.

function resolveFilename(name, parent) {
  return Module._resolveFilename(name, parent);
}

function nodeModulePaths(dir) {
  return Module._nodeModulePaths(dir);
}
