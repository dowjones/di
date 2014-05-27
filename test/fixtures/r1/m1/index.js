module.exports = M1;

function M1(m2) {
  this.m2 = m2;
}

M1.$inject = [
  '../m2'
];

M1.prototype.answer = function () {
  return this.m2.answer();
};
