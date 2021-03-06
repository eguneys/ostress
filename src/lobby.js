const { page } = require('./http');
const { connect } = require('./ws');
const { arand } = require('./util');

const getLobby = function(ctx) {
  const http = {
    method: 'get',
    baseURL: ctx.endpoint.baseUrl,
    url: ctx.endpoint.lobby,
    headers: ctx.headers
  };
  return page({
    http,
    step: 'lobby',
    onResponse: (response) => {
      return {
        masas: response.data.masas
      };
    }
  })(ctx);
};

const hangLobby = function(opts) {

  return ctx => {
    const endpoint = ctx.ws.lobby;
    const handler = new lobbyHandler(opts, ctx);

    return connect({
      endpoint,
      handler
    })(ctx);
  };
};

function lobbyHandler(opts, ctx) {

  this.handlers = opts;

  const joinMasa = () => {
    let masa = arand(ctx.masas);
    this.send("join", masa.id);
  };

  this.in = (data) => {
    if (this.handlers[data.t]) {
      this.handlers[data.t](data.d);
      delete this.handlers[data.t];
    }
  };

  this.onOut = send => {
    this.send = send;

    setInterval(joinMasa, 300);
  };
};

module.exports = {
  getLobby,
  hangLobby
};
