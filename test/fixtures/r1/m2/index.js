module.exports = M2;

function M2(m3) {
  this.m3 = m3;
}

M2.$inject = [
  '../m3'
];

M2.prototype.answer = function () {
  return this.m3.answer();
};
