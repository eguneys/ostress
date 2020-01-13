const { page } = require('./http');
const { connect } = require('./ws');
const { arand } = require('./util');

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
      return response.data;
    }
  })(ctx);
}

const hangMasa = function(opts) {

  return ctx => {
    const endpoint = ctx.url.socket;
    const handler = new masaHandler(opts, ctx);

    return connect({
      endpoint,
      handler
    })(ctx);
  };
};

function masaHandler(opts, ctx) {

  this.handlers = {
    
  };

  this.in = (data) => {
    if (this.handlers[data.t]) {
      this.handlers[data.t](data.d);
    }
  };

  this.onOut = send => {
    this.send = send;
  };
};

module.exports = {
  getMasa,
  hangMasa
};
