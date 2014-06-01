var express = require('express'),
  UserService = require('../services/user'),
  create = require('sinon-lazy-stub');

module.exports = {
  request: create(express.response),
  response: create(express.response),
  router: create(express.Router),
  userService: create(UserService.prototype)
};
