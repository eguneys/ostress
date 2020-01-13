function middle(context,
              ...fns) {
  return fns
    .reduce((pCtx, fn) => pCtx.then(fn), Promise.resolve(context));
}

function tap(fn) {
  
  return ctx => {
    fn(ctx);
    return Promise.resolve(ctx);
  };
};

const log = tap(ctx => {
  console.log(without(ctx, 'endpoint'));
});

function hangOut(ctx) {
  return Promise.resolve(ctx);
}

function buyIn(ctx) {
  return Promise.resolve(ctx);  
}

function without(ctx, ...excludes) {
  let ctx2 = { ...ctx };
  excludes.forEach(exclude => {
    delete ctx2[exclude];
  });
  return ctx2;
}

let { login,
      loginForce } = require('./login');

let { getLobby, hangLobby } = require('./lobby');

let { getMasa, hangMasa } = require('./masa');

module.exports = {
  middle,
  tap,
  hangOut,
  log,
  login,
  loginForce,
  getLobby,
  hangLobby,
  getMasa,
  hangMasa,
  buyIn
};
