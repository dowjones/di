module.exports = M;

function M(http) {
  this.http = http;
}

M.$inject = [
  'http'
];

M.prototype.isOk = function () {
  return ('function' === typeof this.http.createServer);
};
