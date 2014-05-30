module.exports = UsersResource;

/**
 * Responsibility:
 *   To encapsulate logic that pertains
 *   to the handling of the _HTTP_ request.
 *
 *   For example: hanling query or request
 *   params, validating user input, etc.
 *
 *   Business-logic related to this service
 *   should live in the Service.
 */

function UsersResource(svc) {
  this.svc = svc;
}

UsersResource.$inject = [
  '../services/user'
];

UsersResource.prototype.route = function (router) {
  router.get('/', this.list.bind(this));
};

UsersResource.prototype.list = function (req, res, next) {
  this.svc.list(function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
};
