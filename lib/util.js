var resolve = require('resolve'),
  format = require('util').format;

/**
 * Responsibility:
 *   To resolve a path of a module.
 *
 * Using the core Module module (ehem)
 * in order not to re-implement the functionality.
 */

exports.resolveFilename = function (path, basedir) {
  return resolve.sync(path, {basedir: basedir});
};

exports.resolveFilenames = function (paths, basedir) {
  return paths.map(function (path) {
    return exports.resolveFilename(path, basedir);
  });
};

exports.rethrow = function (err, msg /*, ...*/) {
  var args = [].slice.call(arguments);
  err = args.shift();
  err.message = format.apply(null, args) + '. ' + err.message;
  throw err;
};

exports.flattenArray = function (array) {
  return [].concat.apply([], array);
};
