var express = require('express');

exports.createResource = function (di) {
  return setup.bind(null, di);
};

function setup(di, name) {
  var resourcePath = './resources/' + name;
  return create.bind(null, di, resourcePath);
}

function create(di, resourcePath, req, res, next) {
  var router = express.Router(), resource;

  try {
    resource = di.create(resourcePath);
    resource.route(router);
  } catch (err) {
    return next(err);
  }

  router.handle(req, res, next);
}
