const axios = require('axios');

function login(ctx) {
  let steps = (ctx.steps?ctx.steps:[]);
  steps.push('login');

  let ctxStep = { ...ctx, steps };

  return axios({
    method: 'post',
    url: ctx.endpoint.login,
    headers: ctx.headers,
    data: {
      username: ctx.id,
      password: ctx.id
    }
  }).then(response => {
    const loginData = {
      id: response.data.id,
      username: response.data.username,
      avatar: response.data.avatar,
      sessionId: response.data.sessionId
    };

    return { ...ctxStep, 
             ...loginData
           };
  }).catch(e => {
    return {
      ...ctxStep,
      error: {
        status: e.response?e.response.status:0,
      }
    };
  });
};

function signup(ctx) {
  let steps = (ctx.steps?ctx.steps:[]);
  steps.push('signup');

  let ctxStep = { ...ctx, steps };

  return axios({
    method: 'post',
    url: ctx.endpoint.signup,
    headers: ctx.headers,
    data: {
      username: ctx.id,
      password: ctx.id,
      email: `${ctx.id}@ostress.com`
    }
  }).then(response => {
    return { ...ctxStep, username: ctx.id };
  }).catch(e => {
    return {
      ...ctxStep,
      error: {
        status: e.response?e.response.status:0,
      }
    };
  });  
}

function loginForce(ctx) {
  return login(ctx).then(ctx => {
    if (ctx.error && ctx.error.status === 401) {
      return signup(ctx).then(ctx => {
        if (!ctx.error) {
          return login(ctx);
        }
        return ctx;
      });
    }
    return login(ctx);
  });
}

module.exports = {
  login,
  loginForce
};
