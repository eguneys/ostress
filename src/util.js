function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function randInt(min, max) {
  return Math.floor(rand(min, max));
}

function arand(values) {
  return values[randInt(0, values.length)];
}

module.exports = {
  rand,
  randInt,
  arand
};
