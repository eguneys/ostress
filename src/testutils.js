function middle(context,
              ...fns) {
  return fns
    .reduce((ctx, fn) => fn(ctx), context);
}

function hangOut(ctx) {
  console.log(without(ctx, 'endpoint'));
  return ctx;
}

function login(ctx) {
  return ctx;
}

function joinLobby(ctx) {
  return ctx;
}

function joinMasa(ctx) {
  return ctx;
}

function buyIn(ctx) {
  return ctx;  
}

function bots(f, n) {
  let res = [];

  for (let i = 0; i < n; i++) {
    res.push(new Promise(resolve => {
      setTimeout(() => { resolve(f(i)); }, 0);
    }));
  }
  return Promise.all(res);
}

function without(ctx, ...excludes) {
  let ctx2 = { ...ctx };
  excludes.forEach(exclude => {
    delete ctx2[exclude];
  });
  return ctx2;
}

module.exports = {
  bots,
  middle,
  login,
  joinLobby,
  hangOut,
  joinMasa,
  buyIn
};
