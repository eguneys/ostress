const axios = require('axios');

function page(opts) {
  const {
    http,
    step,
    onResponse
  } = opts;

  return ctx => {
    let steps = (ctx.steps?ctx.steps:[]);
    steps.push(step);

    let ctxSteps = { ...ctx, steps };

    return axios(http).then(response => {
      const data = onResponse(response);

      return { ...ctxSteps, 
               ...data
             };
    }).catch(e => {
      return {
        ...ctxSteps,
        error: {
          status: e.response?e.response.status:0,
          message: e
        }
      };
    });
  };
}

module.exports = {
  page
};
