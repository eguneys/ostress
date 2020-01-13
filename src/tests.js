const { log, ok, is, not } = require('testiz');

const tu = require('./testutils');
const makePusher = require('./testpusher');
const { bots, botLevels } = require('./bots');

async function tests(opts) {

  let { endpoint, level } = opts;

  log(`Stress Test (${level}) ${endpoint.baseUrl}`);

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

    return tu
      .middle({ id, ...opts },
              tu.login,
              tu.tap(ctx => {
                is('login unauthorized 401', ctx.error.status, 401);
              }));
  }));

  tP(bots(i => {
    let id = makeId('loginf' + i);

    return tu
      .middle({ id, ...opts },
              tu.loginForce,
              tu.tap(ctx => {
                is('login success', ctx.username, id);
              }));

  }));

  tP(bots((i) => {

    let id = makeId('lobby' + i);

    return tu
      .middle({ id, ...opts },
              tu.loginForce,
              tu.getLobby,
              tu.tap(ctx => {
                ok('get lobby [masas] ' + id, ctx.masas);
              }), 
              tu.hangLobby({
                redirect(d) {
                  ok('redirect', d.id);
                }
              }));

  }, bl.joinLobby));

  tP(bots(i => {
    let id = makeId('masa' + i);

    return tu
      .middle({ id, ...opts },
              tu.loginForce,
              tu.getLobby,
              tu.getMasa,
              tu.tap(ctx => {
                //console.log(ctx.error.status);
                is('get masa ' + id, ctx.nbSeats, ctx.seats.length);
              }),
              tu.hangOut);
  }, bl.joinMasa));

  tPOnly(bots(i => {

    let id = makeId('buyin' + i);

    return tu
      .middle({ id, ...opts },
              tu.login,
              tu.getLobby,
              tu.getMasa,
              tu.hangMasa({
              }),
              tu.hangOut);  
  }, bl.buyIn));

  await Promise.all(pusher.run()).then(console.log);
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
}

const baseUrl = 'http://localhost:9663';
const wsBaseUrl = 'ws://localhost:9664';

const botLevel = process.argv[2] || 'dev';

tests({
  endpoint: {
    baseUrl: baseUrl,
    login: '/login',
    signup: '/signup',
    lobby: '/',
    masa: '/'
  },
  ws: {
    baseUrl: wsBaseUrl,
    lobby: '/lobby/socket'
  },
  headers: {
    Accept: 'application/vnd.oyunkeyf.v1+json'
  },
  level: botLevel
});

process.stdin.resume();
