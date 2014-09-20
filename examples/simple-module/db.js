module.exports = Db;

function Db() {
}

Db.prototype.find = function (query, cb) {
  cb(null, [42]);
};
