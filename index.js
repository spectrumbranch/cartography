var Hapi = require('hapi'),
    options = { };
var masterConfig = require('./config/config');

var serverConfig = masterConfig.config,
	mailConfig = masterConfig.mailconfig,
    server = new Hapi.Server(serverConfig.hostname, serverConfig.port, options);

var util = require('./lib').Util;
var auth = require('./lib').Auth;
var mailer = require('./lib').Mailer;
mailer.init(mailConfig);

server.auth('session', {
    scheme: 'cookie',
    password: 'sdoi239fsER0a1', //TODO: refactor this out to gitignored auth config file
    cookie: 'cartography-cookie',  //?TODO: refactor this out to gitignored auth config file
    redirectTo: '/',
	isSecure: false, //TODO: generate SSL cert, put together config for this
	ttl: 1800000,
	clearInvalid: true
});

server.views({
    engines: {
        html: 'handlebars'            
    },
    path: './lib/views',
	partialsPath: './lib/views/partials'
});


server.route([
  //Cartography Routes
  { method: 'GET', 	path: '/', handler: function() { this.reply.view('index', {anonymous: true}); } },
  { method: '*', 	path: '/version', handler: function() { this.reply(util.version); } },
  //Scurvy Routes
  { method: '*', 	path: '/confirm/{hashkey*}', config: { handler: auth.confirm, auth: false  } },
  { method: 'POST', path: '/register', config: { handler: auth.register, validate: { payload: auth.register_validate(Hapi) }, auth: false  } },
  //{ method: 'POST', path: '/login', config: { handler: auth.login, validate: { payload: auth.login_validate(Hapi) }, auth: false  } },
  //{ method: 'POST', path: '/logout', config: { handler: auth.logout, auth: false  } },
  
  //All static content
  { method: '*', 	path: '/{path*}', handler: { directory: { path: './static/', listing: false, redirectToSlash: true } } }
]);


var db = require('./lib/models');
db.init(function() {
	console.log('database setup complete');
	server.start();
	console.log('Server up at ' + server.info.uri + ' !');
});

