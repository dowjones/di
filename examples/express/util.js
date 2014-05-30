var express = require('express');

exports.createResource = function (ioc) {
  return setup.bind(null, ioc);
};

function setup(ioc, name) {
  var resourcePath = './resources/' + name;
  return create.bind(null, ioc, resourcePath);
}

function create(ioc, resourcePath, req, res, next) {
  var router = express.Router();

  function route(err, resource) {
    if (err) return next(err);
    try { resource.route(router); }
    catch (err) { return next(err); }
    router.handle(req, res, next);
  }

  ioc.create(resourcePath, route);
}
