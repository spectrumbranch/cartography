var Hapi = require('hapi'),
    options = { };
var serverConfig = require('./config/config').config,
    server = new Hapi.Server(serverConfig.hostname, serverConfig.port, options);

var util = require('./lib').Util;
server.route([
  { method: 'GET', path: '/version', handler: function() { this.reply(util.version); } },
  { method: '*', path: '/{path*}', handler: { directory: { path: './static/', listing: false, redirectToSlash: true } } }
]);

server.start();
console.log('Server up at ' + server.info.uri + ' !');
