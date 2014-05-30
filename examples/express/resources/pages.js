module.exports = PageResource;

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

function PageResource() {
}

PageResource.prototype.route = function (router) {
  router.get('/:pageId?', this.render.bind(this));
  router.use(this.error.bind(this));
};

PageResource.prototype.render = function (req, res, next) {
  res.render(req.params.pageId, {
    title: 'Awesome!'
  });
};

PageResource.prototype.error = function (err, req, res, next) {
  if (/failed to lookup/i.test(err.message)) {
    req.params.pageId = 'home';
    return this.render(req, res, next);
  }
  next(err);
};
