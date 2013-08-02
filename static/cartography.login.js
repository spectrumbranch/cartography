$(document).ready(function () {
	//TODO: Include validation for either username or password
	var response=window.location.search.replace("?","");
	if (response == "badlogin")
	{$('#error-modal').foundation('reveal', 'open');}
});