$(document).ready(function () {
	//TODO: Include validation for either username or password
	var response=window.location.search.replace("?","");
	if (response == "badlogin")
	{$('#error-modal').foundation('reveal', 'open');}
	
	$("#login-click").click(function() {
		var error = false;
		var userid = $('#loginuserid').val();
		var passwrd = $('#loginpassword').val();
		
		if (userid.length < 5 || userid.length > 30) {error = true;}		
		if (passwrd.length < 8) {error = true;}
				
		if (error)
		{
			$('#invalid-login-modal').foundation('reveal', 'open');
			return false;
		} 		
	});
	
	
});