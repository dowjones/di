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
  var pageId = req.params.pageId || 'home';
  if (!isValidPageId(pageId)) return next();
  res.render(pageId, {title: 'Awesome!'});
};

PageResource.prototype.error = function (err, req, res, next) {
  if (!isNotFoundError(err)) return next(err);
  res.status(404);
  res.render('404', {title: 'Not Found'});
};

function isValidPageId(pageId) {
  return /^[a-zA-Z0-9-]+$/.test(pageId);
}

function isNotFoundError(err) {
  return (err.view && !err.view.path);
}
