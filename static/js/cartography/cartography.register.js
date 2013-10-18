$(document).ready(function () {
	var isValidEmailAddress = function(emailAddress) {
		var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
		return pattern.test(emailAddress);
	};
	var clearErrors = function() {
		var ids = ['userid','passwrd','passwrd0','email'];
		$.each(ids, function(i, id) {
			removeError(id);
		});
	};
	var showError = function(id, error) {
		var elem = $('#' + id);
		if (!elem.hasClass('error')) {
			elem.addClass('error');
			elem.after('<small class="error" id="'+id+'_error">'+error+'</small>');
		}
	};
	var removeError = function(id) {
		var elem = $('#' + id);
		var errElem = $('#' + id + '_error');
		if (elem.hasClass('error'))	{
			elem.removeClass('error');
		}
		if (errElem) {
			errElem.remove();
		}
	};
	
	var response=window.location.search.replace("?","");
	if (response == "confirmed")
	{$('#confirmed-modal').foundation('reveal', 'open');}
	
	
	$('#register-btn').click(function() {
		clearErrors();
		
		//Step 0: Get the fields
		//Step 1: Validate that the fields are setup appropriately.
		var errors = [];
		
		var userid = $('#userid').val();
		if (userid.length < 5 || userid.length > 30) {
			var userid_length_error = 'User ID must be between 5-30 characters.';
			errors.push(userid_length_error);
			showError('userid',userid_length_error);
		}
		
		var passwrd = $('#passwrd').val();
		if (passwrd.length < 8) {
			var passwrd_length_error = 'Password must be between 8 or more characters.';
			errors.push(passwrd_length_error);
			showError('passwrd',passwrd_length_error);
		}
		
		var passwrd0 = $('#passwrd0').val();
		if (passwrd !== passwrd0) {
			var passwrd_compare_error = 'Password confirmation must match password.';
			errors.push(passwrd_compare_error);
			showError('passwrd0',passwrd_compare_error);
		}
		
		var email = $('#email').val();
		if (email.length > 50 || !isValidEmailAddress(email)) {
			var email_error = 'Email cannot be more than 50 characters and must be valid.';
			errors.push(email_error);
			showError('email',email_error);
		}
		
		if (errors.length > 0) {
			//Don't submit, there are errors.
		} else {
			//No errors!
			//Step 2: Submit form via ajax POST. 
			$.post('/register', $('#register-form').serialize(), function(data) {
				//Step 3: Get response and display a message accordingly.
				//		If OK, disable register so user doesn't register twice.
				//				Inform user that the confirmation email has been sent.
				//		Else, explain why registration failed (if a reason is available).
				if (data.success) {
					//Successfully registered without an error!
					$('#register-dropdown-trigger').click();
					$('#register-dropdown-trigger').removeAttr('data-dropdown');
					$('#register-dropdown-trigger').addClass('disabled');
					//Give user a message saying confirmation email has been sent!
					$('#register-modal').html('<h2>Awesome!</h2><p>Registration was successful! A confirmation email has been sent out to ' + email + '. Please visit the confirmation URL that is found in the email in order to activate your account.</p><a class="close-reveal-modal">&#215;</a>');
					$('#register-modal').foundation('reveal', 'open');
				} else {
					//Error during registration process.
					$('#register-modal').html('<h2>Uh oh!</h2><p>Something went wrong when trying to register you as a new user. Please try again soon.</p><a class="close-reveal-modal">&#215;</a>');
					$('#register-modal').foundation('reveal', 'open');
				}
			}, 'json');
		}
	});
});