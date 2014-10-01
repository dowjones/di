module.exports = Db;

function Db() {
}

Db.$inject = [];

Db.prototype.find = function (query, cb) {
  cb(null, [42]);
};
