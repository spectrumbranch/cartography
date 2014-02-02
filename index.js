var Hapi = require('hapi'),
    options = { cors: true };
var masterConfig = require('./config/config');

var serverConfig = masterConfig.config,
	tlsConfig = masterConfig.tlsconfig,
	mailConfig = masterConfig.mailconfig;
	
if (serverConfig.tls) {
	console.log('Loading tls');
	options.tls = tlsConfig;
}

var server = new Hapi.Server(serverConfig.hostname, serverConfig.port, options);

var Cartography = require('./lib');
var util = Cartography.Util;
var auth = Cartography.Auth;
var mailer = Cartography.Mailer;
var home = Cartography.Home;
var admin = Cartography.Admin;
var scurvy = Cartography.Scurvy;
mailer.init(mailConfig);

server.auth('session', {
    scheme: 'cookie',
    password: serverConfig.cookie_password,
    cookie: serverConfig.cookie_name,
    redirectTo: '/',
	isSecure: serverConfig.tls,
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

login_validate = function() {
	var S = Hapi.types.String;
	return {
		userid: S().required().min(5).max(30),
		passwrd: S().required().min(8),
		view: S()
	}
}

register_validate = function() {
	var S = Hapi.types.String;
	return {
		userid: S().required().min(5).max(30),
		passwrd: S().required().min(8),
		passwrd0: S().required().min(8),
		email: S().email().required().max(50)
	}
}


server.route([
  //Cartography Routes
  { method: 'GET', 	path: '/', config: { handler: home.handler, auth: { mode: 'try' } } },
  { method: '*', 	path: '/version', handler: function() { this.reply(util.version); } },
  //Authentication Routes
  { method: '*', 	path: '/confirm/{hashkey*}', config: { handler: auth.confirm, auth: false  } },
  { method: 'POST', path: '/register', config: { handler: auth.register, validate: { payload: register_validate() }, auth: false  } },
  { method: 'POST', path: '/login', config: { handler: auth.login, validate: { payload: login_validate() }, auth: { mode: 'try' }  } },
  { method: 'GET', path: '/login', config: { handler: auth.login_view, auth: { mode: 'try' }  } },
  { method: '*', path: '/logout', config: { handler: auth.logout, auth: true  } },
  //Administration Routes
  { method: 'GET', path: '/admin', config: { handler: admin.handler, auth: true } },
  
  //All static content
  { method: '*', 	path: '/{path*}', handler: { directory: { path: './static/', listing: false, redirectToSlash: true } } }
]);

//setup/load modules/plugins here
var virt_modules = [];
virt_modules.scurvy = scurvy;

//console.log("process.env.NODE_ENV: [" + process.env.NODE_ENV + "]");
var database_config_to_use = '';
switch (process.env.NODE_ENV) {
	case 'test_travis':
		database_config_to_use = './config/database.test_travis';
		break;
	case undefined:
	case 'production':
	case 'development':
		database_config_to_use = './config/database';
		break;
}
var dbconfig = require(database_config_to_use).config;

var db = require('./lib/models');
db.init(dbconfig, virt_modules, function() {
	console.log('database setup complete');
	
	//start server
	server.start();
	auth.setURI(server.info.uri);
	console.log('Server up at ' + server.info.uri + ' !');
});

