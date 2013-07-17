var internals = {};
internals.redirectAfterFailure = '/';
internals.redirectAuthenticatedDefault = '/';
internals.redirectBadLogin = '/?badlogin';
internals.redirectConfirmationSuccess = '/?confirmed';
internals.data = require('./models');
internals.baseuri = '';

internals.setURI = function(input) {
	internals.baseuri = input;
}

var scurvy = require('scurvy');

internals.confirm = function() {
	var request = this;
	scurvy.doesMetastateHashkeyHaveUser(this.params.hashkey, function(err, result) {
		if (!result) {
			request.reply.redirect(internals.redirectAfterFailure);
		} else {
			//result is an object containing user and metastate.
			scurvy.activateUser(result, function(err2, activationResult) {
				if (err2) {
					console.log('auth.confirm: Error from activateUser: ' + err2);
					request.reply.redirect(internals.redirectAfterFailure);
				} else {
					console.log('auth.confirm: user has been activated');
					request.reply.redirect(internals.redirectConfirmationSuccess);
				}
			});
		}
	});
}

internals.register = function(request) {
	var errors = [];
	
	if (!this.payload) {
		console.log("Register endpoint hit: Not a payload");
		errors.push("No valid payload sent.");
		request.reply({ success: false, errors: errors });
	} else {
		console.log("Register endpoint hit: A payload");

		// 1.) take in payload and grab each parameter
		//		userid, email, passwrd, passwrd0 (confirmation)
		var userid = this.payload.userid;
		var passwrd = this.payload.passwrd;
		var passwrd0 = this.payload.passwrd0;
		var email = this.payload.email;
		
		// 2.) validate parameters - https://github.com/spumko/hapi/blob/master/examples/validation.js
		//		route validation:: validate: { query: { userid: Hapi.types.String().required().with('passwrd') ...etc } }
		// Some route validation happens in the routing mechanism at the moment.
		
		//Password must match confirmation.
		if (passwrd !== passwrd0) {
			errors.push('Confirmation password does not match.');
		}
		
		if (errors.length > 0) {
			//don't create user, send error response
			request.reply({ success: false, errors: errors });
		} else {
			// 3.) create deactivated user with a metastate record. requires creating the metastate hashkey from the user's salt and email (create user, send OK)
			
			scurvy.createUser({userid: userid, email: email, passwrd: passwrd, status: 'inactive'}, function(err, userball) {
				if (err) {
					errors.push(err);
					console.log('Error when trying to create user: ' + err);
					request.reply({ success: false, errors: errors });
				} else {
					internals.sendConfirmationEmail(email, userball.metastate.hashkey, function(err, result) {
						console.log("(2)send mail finished! with result: " + result);
						request.reply({ success: result });
					});
				}
			});
		}
	}
}

internals.sendConfirmationEmail = function(email, hashkey, callback) {
	var mailer = require('./index').Mailer;
	//var conf = require('../config/config').config;

	//if (internals.baseuri === '') {
	//	confirmationUrl = 'http://' + conf.hostname + ':' + conf.port + '/confirm/' + hashkey;
	//} else {
	var confirmationUrl = internals.baseuri + '/confirm/' + hashkey;
	//}
	
	mailer.sendEmail(email,
		"Cartography - Confirm Registration", //subject
		"Hello! Someone using this email address (" + email + ") has made an account registration request for the Spectrum Branch application Cartography. If you intended to register, please confirm your registration by clicking the following link: " + confirmationUrl + " \n If you did not intend to register, please feel free to ignore and delete this email. Thanks!", //body
		function(err, result) {
			console.log("send mail finished! with result: " + result);
			if (err) { console.log(err); }
			//send OK
			callback(err, result);
		}
	);
}

internals.login = function() {
	var request = this;
	if (request.auth.isAuthenticated) {
		return request.reply.redirect(internals.redirectAuthenticatedDefault);
	}
	var message = '';
	var account = null;
	
	if (!request.payload.userid || !request.payload.passwrd) {
		message = 'Missing username or password';
	} else {
		var password_input = request.payload.passwrd;
		var userid_input = request.payload.userid;
		var isView = request.payload.view === 'true';
		
		scurvy.verifyCredentials({userid: userid_input, passwrd: password_input}, function(err, user) {
			if (user) {
				//It matches!
				request.auth.session.set(user);
				return request.reply.redirect(internals.redirectAuthenticatedDefault);
			} else {
				//It doesn't match.
				if (isView) {
					//TODO replace with method informing main page to show incorrect password error message
					return request.reply.redirect(internals.redirectBadLogin);
				} else {
					//is JSON API format
					message = 'Invalid username or password';
					return request.reply({ status: 'errors', errors: [message] });
				}
			}
		})
	}
}

//TODO redo to look nice and stuff.
internals.login_view = function() {
	if (this.auth.isAuthenticated) {
		return this.reply.redirect(internals.redirectAuthenticatedDefault);
	}
	var message = '';
	
	return this.reply('<html><head><title>Login page</title></head><body>'
		+ (message ? '<h3>' + message + '</h3><br/>' : '')
		+ '<form method="post" action="/login">'
		+ 'Username: <input type="text" name="userid"><br/>'
		+ 'Password: <input type="password" name="passwrd"><br/>'
		+ '<input type="submit" value="Login"></form></body></html>');

}

internals.logout = function() {
    if (this.auth.session) {
		this.auth.session.clear();
	}
    return this.reply.redirect('/')
}

exports.logout = internals.logout;
exports.login = internals.login;
exports.login_view = internals.login_view;
exports.confirm = internals.confirm;
exports.register = internals.register;

exports.setURI = internals.setURI;