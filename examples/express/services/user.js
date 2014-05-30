module.exports = UserService;

/**
 * Responsibility:
 *   To encapsulate business logic.
 */

function UserService() {
}

UserService.prototype.list = function (cb) {
  cb(null, [{
    name: 'heather'
  }, {
    name: 'dan'
  }]);
};
