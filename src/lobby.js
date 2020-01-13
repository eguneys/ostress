const { page } = require('./http');

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

module.exports = {
  getLobby
};
