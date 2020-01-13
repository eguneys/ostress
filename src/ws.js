const WebSocketClient = require('websocket').client;

function connect(opts) {

  const { endpoint, headers, handler } = opts;

  return (ctx) => {

    let sri = Math.random().toString(36).slice(2, 12);

    let url = `${ctx.ws.baseUrl}${endpoint}?sri=${sri}`;

    const ws = new WebSocketClient();

    let res = new Promise((resolve, reject) => {

      ws.on('connect', function(connection) {

        connection.on('close', function() {
          reject('websocket closed ' + endpoint);
        });

        connection.on('message', function(data) {
          handler.in(JSON.parse(data.utf8Data));
        });


        function sendRaw(data) {
          connection.sendUTF(data);
        }

        function send(typ, data) {
          sendRaw(JSON.stringify({ t: typ, d: data }));
        };

        function ping() {
          sendRaw("null");
        }

        setInterval(ping, 2000);

        handler.onOut(send);
      });

    });


    const protocols = [],
          origin = null;

    ws.connect(url, protocols, origin, headers);

    return res;
  };
}

module.exports = {
  connect
};
