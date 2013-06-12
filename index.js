var Hapi = require('hapi'),
    options = { };
var serverConfig = require('./config/config').config,
    server = new Hapi.Server(serverConfig.hostname, serverConfig.port, options);

server.route([
  { method: '*', path: '/{path*}', handler: { directory: { path: './www/', listing: false, redirectToSlash: true } } }
]);

server.start();
console.log('Server up at ' + server.info.uri + ' !');
