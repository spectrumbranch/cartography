var internals = {};
internals.redirectAfterFailure = '/';
internals.data = require('./models');

var scurvy = require('scurvy');

//TODO test, move to use scurvy
internals.doesMetastateHashkeyHaveUser = function(hashkey, callback) {
	console.log('confirm:hashkey: ' + hashkey);
	internals.data.Metastate.find({
		where: {
			hashkey: hashkey
		}
	}).success(function(metastate) {
		if (metastate != null) {
			console.log('confirm:metastate user_id: ' + metastate.UserId);
			internals.data.User.find({
				where: {
					id: metastate.UserId
				}
			}).success(function(user) {
				if (user != null) {
					console.log('confirm:user.email : ' + user.email);
					//validated!
					callback(null, { user: user, metastate: metastate});
				} else {
					//not a match!
					callback(null, false);
				}
			});
		} else {
			//not a match!
			callback(null, false);
		}
	});
}

internals.activateUser = function(input, callback) {
	var metastate = input.metastate;
	metastate.updateAttributes({
		status: 'active'
	}).success(function() {
		console.log('auth.activateUser(): success! User has been activated!');
		callback(null, true);
	}).error(function(err) {
		console.log("auth.activateUser(): error");
		console.log(err);
		callback(null, false);
	});
}

internals.confirm = function() {
	var request = this;
	internals.doesMetastateHashkeyHaveUser(this.params.hashkey, function(err, result) {
		if (!result) {
			request.reply({ temporary: false });//temporary response for testing
			//TODO: uncomment following when testing is done
			//this.reply.redirect(internals.redirectAfterFailure);
		} else {
			//result is an object containing user and metastate.
			internals.activateUser(result, function(err2, activationResult) {
				if (err2) {
					console.log('auth.confirm: Error from activateUser: ' + err2);
					request.reply({ temporary: false });//temporary response for testing
				} else {
					console.log('auth.confirm: user has been activated');
					request.reply({ temporary: true });//temporary response for testing
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
			var User = internals.data.User;
			var Metastate = internals.data.Metastate;
			
			scurvy.generateNewHash(passwrd, function(err, hashcake) {
				var salt = hashcake.salt;
				var hash = hashcake.hash;
				
				User.create({ userid: userid, email: email, salt: salt, hash: hash }).success(function(user) {
					console.log("successfully created user " + userid);
					
					scurvy.generateMetastateHashkey(email, salt, function(err, result) {
						if (err) { console.log("error when generating metastate hashkey:" + err); }
						
						var hashkey = result.hashkey;
						
						Metastate.create({ status: "inactive", hashkey: hashkey }).success(function(metastate) {
							console.log("successfully created metastate");
							user.setMetastate(metastate).success(function() {
								//successfully saved
								console.log("successfully saved user to metastate association for email " + email + " and hashkey " + hashkey + ".");
								internals.sendConfirmationEmail(email, hashkey, function(err, result) {
									console.log("(2)send mail finished! with result: " + result);
									request.reply({ success: result });
								});
							});
						});//if error?
					});
				});//if error?
			});
		}
	}
}

internals.sendConfirmationEmail = function(email, hashkey, callback) {
	var mailer = require('./index').Mailer;
	var conf = require('../config/config').config;
	//TODO: should use server.info.uri when constructing url
	var confirmationUrl = 'http://' + conf.hostname + ':' + conf.port + '/confirm/' + hashkey;
	
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

//TODO
internals.login = function() {

}
//TODO
internals.logout = function() {

}



exports.logout = internals.logout;
exports.login = internals.login;
exports.confirm = internals.confirm;
exports.register = internals.register;

/*

//testing data
var users = {
    john: {
        id: 'john',
        password: 'password',
        name: 'John Doe'
    }
};

exports.login = function () {
  if (this.auth.isAuthenticated) {
    return this.reply.redirect('/');
  }
  var message = '';
  var account = null;
  


  if (this.method === 'post') {

    console.log("un: " + this.payload.username);
    console.log("pw: " + this.payload.password);
    if (!this.payload.username || !this.payload.password) {
      message = 'Missing username or password';
    } else {
      account = users[this.payload.username];
      if (!account || account.password !== this.payload.password) {
        message = 'Invalid username or password';
      }
    }
  }

  if (this.method === 'get' || message) {
    return this.reply('<html><head><title>Login page</title></head><body>'
          + (message ? '<h3>' + message + '</h3><br/>' : '')
          + '<form method="post" action="/login">'
          + 'Username: <input type="text" name="username"><br/>'
          + 'Password: <input type="password" name="password"><br/>'
          + '<input type="submit" value="Login"></form></body></html>');
  }

  this.auth.session.set(account);
  return this.reply.redirect('/');
};

exports.logout = function () {
    this.auth.session.clear();
    return this.reply.redirect('/');
};
*/