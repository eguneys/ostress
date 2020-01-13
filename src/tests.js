const { log, ok, is, not } = require('testiz');

const tu = require('./testutils');
const { bots } = tu;

function tests(opts) {

  let { endpoint } = opts;

  log('Stress Test ' + endpoint);

  bots((i) => {

    tu.middle({ id: 'lobby' + i, endpoint },
              tu.login,
              tu.joinLobby,
              tu.hangOut);

  }, 10);

  bots(i => {
    tu.middle({ id: 'masa' + i, endpoint },
              tu.login,
              tu.joinLobby,
              tu.joinMasa,
              tu.hangOut);
  }, 10);

  bots(i => {

    tu.middle({ id: 'buyin' + i, endpoint },
              tu.login,
              tu.joinLobby,
              tu.joinMasa,
              tu.buyIn,
              tu.hangOut);  
  }, 10);

}

tests({
  endpoint: {
    http: 'localhost:9663',
    ws: 'localhost:9664'
  }
});
