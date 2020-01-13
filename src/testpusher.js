module.exports = function TestPusher({ warnOnly }) {

  let res = [];

  this.push = f => {
    res.push({ work: f });
  };

  this.pushOnly = f => {
    res.push({ work: f, only: true });
  };

  this.tP = this.push;
  this.tPOnly = this.pushOnly;

  const maybeWarnOnly = l => {
    if (warnOnly) {
      warnOnly(l);
    }
  };

  this.run = () => {
    let runs = res;

    let only = res.filter(_ => _.only);

    if (only.length > 0) {
      runs = only;
      maybeWarnOnly(only.length);
    }

    return runs.map(_ => _.work());
  };

  
};
