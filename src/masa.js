const { page } = require('./http');
const { connect } = require('./ws');
const { rand, arand } = require('./util');

function getMasa(ctx) {
  let masa = arand(ctx.masas);

  const http = {
    method: 'get',
    baseURL: ctx.endpoint.baseUrl,
    url: `${ctx.endpoint.masa}${masa.id}`,
    headers: ctx.headers
  };
  return page({
    http,
    step: 'masa',
    onResponse: (response) => {
      return { "masa":  response.data };
    }
  })(ctx);
}

const hangMasa = function(opts) {

  return ctx => {
    const sessionId = ctx.sessionId;
    const endpoint = ctx.masa.url.socket;
    const headers = {
      Cookie: `oyun2=sessionId=${sessionId}`
    };

    const handler = new masaHandler(opts, ctx);

    return connect({
      endpoint,
      handler,
      headers
    })(ctx);
  };
};

function masaHandler(opts, ctx) {

  let masa = ctx.masa;
  let seats = masa.seats;

  const rD = (f, delay = 1000) => {
    setTimeout(f, rand(0, delay));
  };

  const emptySeatIndex = () => {
    return seats.reduce((acc, seat, i) => {
      if (seat === null) {
        return i;
      }
      return acc;
    }, -1);
  };

  const maybeJoin = () => {
    let empty = emptySeatIndex();
    if (empty !== -1) {
      this.send("sit", empty + "");
    }
  };

  const maybeLeave = () => {
    this.send('sitoutNext', true);
  };

  const side = (side) => parseInt(side);

  this.handlers = {
    sitoutnext(data) {
      seats[side(data.side)] = data.player;
      rD(maybeJoin);
    },
    buyin(data) {
      seats[side(data.side)] = data.player;
      rD(maybeLeave);
    }
  };

  this.in = (data) => {
    if (this.handlers[data.t]) {
      this.handlers[data.t](data.d);
    }
  };

  this.onOut = send => {
    this.send = send;
    rD(maybeJoin);
  };
};

module.exports = {
  getMasa,
  hangMasa
};
