/***********************************************************
 *	spectrumbranch.difractal.core-0.1.0
 *		difractal.core supports gamestate switching and 
 *		basic entity management.
 *		Dependent on jquery-1.7.2.min.js
 *
 *		Written by Matt Vegh and Christopher Bebry
 *		Copyright 2012 spectrumbranch
 ***********************************************************/


var Difractal = {
	Version : {
		Core: "0.1.0"
	}
};

Difractal.GlobalNamespace = this;

Difractal.Include = function(module, version) {
	//Only currently programmed to handle files in the current directory.
	var prefix = "difractal.";
	var suffix = ".js";
	var moduleSuffix = "-";
	
	var filename = prefix + module + moduleSuffix + version + suffix;
	var fileref = document.createElement('script');
	fileref.setAttribute("type","text/javascript");
	fileref.setAttribute("src", filename);

	//if (typeof fileref!="undefined")
	document.getElementsByTagName("head")[0].appendChild(fileref);
	
//	function loadjscssfile(filename, filetype) {
//		if (filetype=="js") { //if filename is a external JavaScript file
//			var fileref=document.createElement('script')
//			fileref.setAttribute("type","text/javascript")
//			fileref.setAttribute("src", filename)
//		} else if (filetype=="css") { //if filename is an external CSS file
//			var fileref=document.createElement("link")
//			fileref.setAttribute("rel", "stylesheet")
//			fileref.setAttribute("type", "text/css")
//			fileref.setAttribute("href", filename)
//		}
//		if (typeof fileref!="undefined")
//			document.getElementsByTagName("head")[0].appendChild(fileref)
//	}
//	loadjscssfile("myscript.js", "js") //dynamically load and add this .js file
//	loadjscssfile("javascript.php", "js") //dynamically load "javascript.php" as a JavaScript file
//	loadjscssfile("mystyle.css", "css") ////dynamically load and add this .css file
}

Difractal.Master = [];
Difractal.DrawFrequency = 33;
Difractal.ClearCanvas = function() {
	if (Difractal.Context != null && Difractal.CanvasRef != null) {
		Difractal.Context.clearRect(0, 0, Difractal.CanvasRef.width, Difractal.CanvasRef.height);
		var w = Difractal.CanvasRef.width;
		Difractal.CanvasRef.width = 1;
		Difractal.CanvasRef.width = w;
	}
}
Difractal.CanvasRef = null;
Difractal.Context = null;

//Draw Loop
Difractal.Draw = function() {
	var index = Difractal.Master.length-1;
	Difractal.ClearCanvas();
	Difractal.Master[index].Draw(Difractal.Context);
}

$(document).ready(function () {
	setInterval(Difractal.Draw, Difractal.DrawFrequency);
});