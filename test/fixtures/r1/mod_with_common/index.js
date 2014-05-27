module.exports = M;

function M(common) {
  this.common = common;
}

M.$inject = [
  'common'
];

M.prototype.get = function () {
  return this.common.get();
};
