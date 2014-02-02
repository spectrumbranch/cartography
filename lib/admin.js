var internals = {};

internals.handler = function() {
	var request = this;
	var result = { anonymous: true, userid: 'anonymous', isAdmin: false };

	console.log('test')
	var session = request.auth.credentials 
	if (session) {
		console.log(JSON.stringify(session));
		result.anonymous = false;
		result.userid = session.userid;
		result.isAdmin = !!session.isAdmin;
	}
	if (result.isAdmin) {
		request.reply.view('admin', result);
	} else {
		request.reply({error: "Not Authorized"});
	}
	
}

exports.handler = internals.handler;