const { log, ok, is, not } = require('testiz');

const tu = require('./testutils');
const makePusher = require('./testpusher');
const { bots, botLevels } = require('./bots');

async function tests(opts) {

  let { endpoint, level } = opts;

  log('Stress Test ' + endpoint.base);

  const makeId = (id) => id;

  const pusher = new makePusher({
    warnOnly: (l) => {
      console.log('running only ', l);
    }
  });

  const { tP, tPOnly } = pusher;

  const bl = new botLevels(level);

  tP(bots((i) => {
    let id = makeId('login' + i);

    tu.middle({ id, ...opts },
              tu.login,
              tu.tap(ctx => {
                is('login unauthorized 401', ctx.error.status, 401);
              }));
  }));

  tP(bots(i => {
    let id = makeId('loginf' + i);

    tu.middle({ id, ...opts },
              tu.loginForce,
              tu.tap(ctx => {
                is('login success', ctx.username, id);
              }));

  }));

  tPOnly(bots((i) => {

    let id = makeId('lobby' + i);

    tu.middle({ id, ...opts },
              tu.loginForce,
              tu.joinLobby,
              tu.tap(ctx => {
                console.log(ctx.steps, ctx.error);
                is('join lobby ' + id, ctx.username, id);
              }),
              tu.hangOut);

  }, bl.joinLobby));

  tP(bots(i => {
    let id = makeId('masa' + i);

    tu.middle({ id, ...opts },
              tu.login,
              tu.joinLobby,
              tu.joinMasa,
              tu.hangOut);
  }, bl.joinMasa));

  tP(bots(i => {

    let id = makeId('buyin' + i);

    tu.middle({ id, ...opts },
              tu.login,
              tu.joinLobby,
              tu.joinMasa,
              tu.buyIn,
              tu.hangOut);  
  }, bl.buyIn));

  return Promise.all(pusher.run());
}

const baseUrl = 'http://localhost:9663';

tests({
  endpoint: {
    base: baseUrl,
    login: `${baseUrl}/login`,
    signup: `${baseUrl}/signup`,
    ws: 'localhost:9664',
  },
  headers: {
    Accept: 'application/vnd.oyunkeyf.v1+json'
  },
  level: 'dev'
});
