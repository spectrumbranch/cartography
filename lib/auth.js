var internals = {};
internals.redirectAfterFailure = '/';
internals.data = require('./models');

var scurvy = require('scurvy');

//TODO test, move to use scurvy
internals.doesMetastateHashkeyHaveUser = function(hashkey, callback) {
	internals.data.Metastate.find({
		hashkey: hashkey
	}).success(function(metastate) {
		if (metastate != null) {
			internals.data.User.find({
				id: metastate.UserId
			}).success(function(user) {
				if (user != null) {
					//validated!
					callback(null, true);
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

internals.confirm = function() {
	var request = this;
	internals.doesMetastateHashkeyHaveUser(this.params.hashkey, function(err, result) {
		if (!result) {
			request.reply({ temporary: false });//temporary response for testing
			//TODO: uncomment following when testing is done
			//this.reply.redirect(internals.redirectAfterFailure);
		} else {
			//TODO: deactivate the metastate confirmation record and do steps to activate the accompanying user
			request.reply({ temporary: true });//temporary response for testing
		}
	});
}

internals.register = function(request) {
	var errors = [];
	
	if (!this.payload) {
		console.log("Register endpoint hit: Not a payload");
		errors.push("No valid payload sent.");
		request.reply({ status: "errors", errors: errors });
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
			request.reply({ status: "errors", errors: errors });
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
								console.log("successfully saved user to metastate association");
								
								//send OK
								request.reply({ status: 'success' });
							});
						});//if error?
					});
				});//if error?
			});
		}
	}
}
exports.register_validate = function(Hapi) {
	var S = Hapi.types.String;
	return {
		userid: S().required().min(5).max(30),
		passwrd: S().required().min(8),
		passwrd0: S().required().min(8),
		email: S().email().required().max(50)
	}
}

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