var internals = {};
internals.redirectAfterFailure = '/';
internals.redirectAuthenticatedDefault = '/';
internals.data = require('./models');
internals.baseuri = '';

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
					request.reply.redirect(internals.redirectAuthenticatedDefault);
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
			
			internals.createUser({userid: userid, email: email, passwrd: passwrd, status: 'inactive'}, function(err, userball) {
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

//TODO: params validation
internals.createUser = function(params, callback) {
	var userid = params.userid; //TODO: cannot be blank
	var email = params.email; //TODO: cannot be blank
	var passwrd = params.passwrd; //TODO: cannot be blank
	var status = params.status; //TODO: must be active, inactive, or deleted. if left out, default to inactive

	var User = internals.data.User;
	var Metastate = internals.data.Metastate;
	
	scurvy.generateNewHash(passwrd, function(err, hashcake) {
		var salt = hashcake.salt;
		var hash = hashcake.hash;
		
		User.create({ userid: userid, email: email, salt: salt, hash: hash }).success(function(user) {
			console.log("successfully created user " + userid);
			
			scurvy.generateMetastateHashkey(email, salt, function(err1, result) {
				if (err1) { console.log("error when generating metastate hashkey:" + err1); }
				
				var hashkey = result.hashkey;
				
				Metastate.create({ status: status, hashkey: hashkey }).success(function(metastate) {
					console.log("successfully created metastate");
					user.setMetastate(metastate).success(function() {
						//successfully saved
						console.log("successfully saved user to metastate association for email " + email + " and hashkey " + hashkey + ".");
						callback(null, {user: user, metastate: metastate});
					});
				});//if error?
			});
		}).error(function(error) {
			callback(error, null);
		});
	});
};

internals.sendConfirmationEmail = function(email, hashkey, callback) {
	var mailer = require('./index').Mailer;
	var conf = require('../config/config').config;
	//TODO: should use server.info.uri when constructing url
	var confirmationUrl = '';
	if (internals.baseuri === '') {
		confirmationUrl = 'http://' + conf.hostname + ':' + conf.port + '/confirm/' + hashkey;
	} else {
		confirmationUrl = internals.baseuri + '/confirm/' + hashkey;
	}
	
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
//TODO test, move to use scurvy
exports.register_validate = function(Hapi) {
	var S = Hapi.types.String;
	return {
		userid: S().required().min(5).max(30),
		passwrd: S().required().min(8),
		passwrd0: S().required().min(8),
		email: S().email().required().max(50)
	}
}

//TODO test, move to use scurvy
exports.login_validate = function(Hapi) {
	var S = Hapi.types.String;
	return {
		userid: S().required().min(5).max(30),
		passwrd: S().required().min(8)
	}
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
		
		internals.data.User.find({ where: { userid: userid_input }, include: [ internals.data.Metastate ] }).success(function(user) {
			//console.log(JSON.stringify(user));
			if (user.metastate.status = 'active') {
				scurvy.comparePlaintextToHash(password_input, user.hash, function (err, matches) {
					if (matches) {
						//It matches!
						request.auth.session.set(user);
						return request.reply.redirect(internals.redirectAuthenticatedDefault);
					} else {
						//It doesn't match.
						if (isView) {
							//TODO replace with method informing main page to show incorrect password error message
							return request.reply.redirect(internals.redirectAuthenticatedDefault);
						} else {
							//is API format
							message = 'Invalid username or password';
							return request.reply({ status: 'errors', errors: [message] });
						}
					}
				})
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

//TODO test
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

exports.setURI = internals.setURI = function(input) {
	internals.baseuri = input;
}