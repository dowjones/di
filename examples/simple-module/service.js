module.exports = Service;

function Service(db) {
  this._db = db;
}

Service.$inject = [
  './db'
];

Service.prototype.answers = function (cb) {
  this._db.find('answers', cb);
};
