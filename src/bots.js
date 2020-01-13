function bots(f, n = 1) {

  return function() {
    let res = [];

    for (let i = 0; i < n; i++) {
      res.push(new Promise(resolve => {
        setTimeout(() => { f(i).then(resolve); }, 0);
      }));
    }
    return Promise.all(res);
  };

}

function botLevels(level) {
  const limit = (n) => {
    let max = n;
    let half = max / 2;
    let third = max / 3;
    let min = 1;

    if (level === 'dev') {
      return min;
    } else if (level === 'third') {
      return third;
    } else if (level === 'half') {
      return half;
    } else if (level === 'max') {
      return max;
    }
    return min;
  };

  this.joinLobby = limit(10);
  this.joinMasa = limit(10);
  this.buyIn = limit(10);
}

module.exports = {
  bots,
  botLevels
};
