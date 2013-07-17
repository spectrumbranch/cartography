var Util = require('./util');
var internals = {};
internals.handler = function() {
	var request = this;
	var result = { version: Util.version, anonymous: true, userid: 'anonymous' };

	
	var session = request.auth.credentials 
	if (session) {
		console.log(JSON.stringify(session));
		result.anonymous = false;
		result.userid = session.userid;
	}
	
	request.reply.view('index', result);
}

exports.handler = internals.handler;