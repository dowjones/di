module.exports = M3;

function M3() {
  this._computedAnswer = 42;
}

M3.prototype.answer = function () {
  // ensuring `this` is proper
  return this._computedAnswer;
};
