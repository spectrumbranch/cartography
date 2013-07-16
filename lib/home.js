var Util = require('./util');
var internals = {};
internals.handler = function() {
	var request = this;
	var anonymous = true;
	var userid = 'anonymous';
	
	var session = request.auth.credentials 
	if (session) {
		console.log(JSON.stringify(session));
		anonymous = false;
		userid = session.userid;
	}
	
	request.reply.view('index', {anonymous: anonymous, userid: userid, version: Util.version });
}

exports.handler = internals.handler;