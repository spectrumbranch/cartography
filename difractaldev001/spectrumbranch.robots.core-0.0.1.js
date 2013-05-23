 /***********************************************************
 *	spectrumbranch.robots.core-0.0.1
 *		robots.core is the runtime specific code to run the 
 *		client side robots program.
 *
 *		Written by Christopher Bebry
 *		Copyright 2012 spectrumbranch
 ***********************************************************/
 
 $(document).ready(function () {
	Difractal.CanvasRef = document.getElementById("difractaldev001");
	Difractal.Context = Difractal.CanvasRef.getContext("2d");
	
	var loadingMask = new GameState();
	
	var loadingMessage = new Difractal.Rectangle(0, 0, 800, 600);
	
	loadingMessage.SetFillStyle("rgba(255, 0, 255, 0.1)");
	loadingMessage.SetText("Loading...");
	loadingMessage.SetTextColor("#000");
	loadingMessage.Action = function() { };
	
	loadingMask.AddRange([loadingMessage]);
	Difractal.Master.push(loadingMask);
	
	
	//Check and wait to see if the user is logged in or not.
	$.ajax({
		type: "POST",
		url: "http://devcloud.spectrumbranch.com/ajax/proxy.php", /* TODO: refactor URL to use hostname via php*/
		data: { testsess: "q" }
	}).done(function(json) {
		var obj = JSON.parse(json);
		if (obj.username == null) {
			//User is not logged in
			console.log("User is not logged in.");
			//This line below is just a test.
			//Difractal.Include("gamestate","0.1.1");
			
			var notLoggedInMenu = new GameState();
			
			var notLoggedInMask = new Difractal.Rectangle(0, 0, 800, 600);
			notLoggedInMask.SetFillStyle("#123456");
			notLoggedInMask.SetText("You are not logged in.\nPlease log in.");
			notLoggedInMask.SetTextColor("#FFF");
			notLoggedInMask.Action = function() {
				window.location = "http://devcloud.spectrumbranch.com/login?ref=/dev/difractal";
			};
			notLoggedInMenu.AddRange([notLoggedInMask]);
			Difractal.Master.push(notLoggedInMenu);
		} else {
			//User is logged in
			console.log("User is logged in as: "+obj.username+".");
			if (obj.robotname == null) {
				console.log("User has no robot.");
				
				//TODO: Give user option to create a robot!
			} else {
				console.log("User has a robot and its name is: " + obj.robotname + ".");
				
				var viewRobotMenu = new GameState();
	
				var viewRobotButton = new Difractal.Rectangle(300, 237.5, 200, 50);
				viewRobotButton.SetFillStyle("#123456");
				viewRobotButton.SetText("View Robot");
				viewRobotButton.SetTextColor("#FFF");
				viewRobotButton.Action = function() {
					Difractal.ClearCanvas();
					Difractal.Master.push(viewRobotMenu);	
				};

				var spendPointsButton = new Difractal.Rectangle(300, 312.5, 200, 50);
				spendPointsButton.SetFillStyle("#123456");
				spendPointsButton.SetText("Spend Points");
				spendPointsButton.SetTextColor("#FFF");
				spendPointsButton.SetZIndex(2);

				var rectangles = [viewRobotButton, spendPointsButton];
				var mainMenu = new GameState();
				
				mainMenu.AddRange(rectangles);
				Difractal.Master.push(mainMenu);
				
				var backButton = new Difractal.Rectangle(300, 275, 200, 50);
				backButton.SetFillStyle("#123456");
				backButton.SetText("Back");
				backButton.SetTextColor("#FFF");
				backButton.Action = function(){
					Difractal.ClearCanvas();
					Difractal.Master.pop(viewRobotMenu);
				}
				
				viewRobotMenu.Add(backButton);
			}
		}
	});
	
 });