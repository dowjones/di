var path = require('path'),
  Module = require('module');

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
  if (isCoreNodeModule) return module;
  module.load(filename);
  return module;
};

exports.resolveFilename = function (name, parent) {
  return resolveFilename(name, parent);
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
