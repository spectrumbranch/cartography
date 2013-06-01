var Difractal = {};
Difractal.GlobalNamespace = this;
Difractal.Master = [];
Difractal.CurrentState;
Difractal.ctx;
Difractal.c;
Difractal.DrawRate = 33;
Difractal.Difficulty = 50;
Difractal.translation = {"x" : 0 , "y" : 0};
Difractal.scale = {"x" : 1 , "y" : 1};
Difractal.Canvases = {};

Difractal.AddCanvas = function(selector){
	var c = $(selector);
	var ctx = c[0].getContext("2d");
	var CanvasObject = {"c" : c , "ctx" : ctx};
	CanvasObject.Master = [];
	CanvasObject.CurrentState = {};
	CanvasObject.Master.Pop = function () {
		this.pop();
		var index = this.length-1;
		CanvasObject.CurrentState = this[index];
	}
	CanvasObject.Master.Push = function (state) {
		this.push(state);
		CanvasObject.CurrentState = state;
	}
	CanvasObject.ClearCanvas = function (context, canvas) {
		context.clearRect(0, 0, canvas.width, canvas.height);
		var w = canvas.width;
		canvas.width = 1;
		canvas.width = w;	
	}
	CanvasObject.Draw = function () {
		CanvasObject.ClearCanvas(CanvasObject.ctx,CanvasObject.c);
		CanvasObject.CurrentState.Draw(CanvasObject.ctx);
	}
	CanvasObject.DrawEnabled = true;
	Difractal.Canvases[selector] = CanvasObject;
}

/*
Difractal.Master.Pop = function () {
	this.pop();
	var index = this.length-1;
	Difractal.CurrentState = this[index];
}

Difractal.Master.Push = function () {
	this.push(state);
	Difractal.CurrentState = state;
}

Difractal.ClearCanvas = function (context, canvas) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    var w = canvas.width;
    canvas.width = 1;
    canvas.width = w;
}


Difractal.Draw = function () {
   Difractal.ClearCanvas(Difractal.Context,Difractal.CanvasRef);
    Difractal.CurrentState.Draw(Difractal.Context);
}
*/
Difractal.Start = function () {
	//Bimd Global Listeners

	var keys = [];

	$(document).keyup(function(e) {
		delete keys[e.which];
	});
	$(document).keydown(function(e) {
		keys[e.which] = true;
		for (var x in Difractal.Canvases) {
			Difractal.Canvases[x].CurrentState.KeyDownEvents(e);
		}
		e.preventDefault();
	});	
	
	$(document).mouseup(function(e) {
		for (var x in Difractal.Canvases) {
			Difractal.Canvases[x].CurrentState.MouseUpEvents(e);
		}
	});	
	
	$(document).mousemove(function(e) {
		for (var x in Difractal.Canvases) {
			Difractal.Canvases[x].CurrentState.MouseMoveEvents(e);
		}
	});	
	
	$.each(Difractal.Canvases, function(index,value) {
		$(index).click(function(e) {
			Difractal.Canvases[index].CurrentState.ClickEvents(e);
		}).mousedown(function(e) {
			Difractal.Canvases[index].CurrentState.MouseDownEvents(e);
		});
	});
	
	//Start it up
	Difractal.Update();
};

Difractal.Update = function () {
	Difractal.UpdateID = setInterval(function () {
	 for(var x in Difractal.Canvases) {
	    var _CanvasObject = Difractal.Canvases[x];
	   if(_CanvasObject.DrawEnabled) {
		_CanvasObject.Draw();
	   }
		_CanvasObject.CurrentState.Events();
	 }
	}, Difractal.DrawRate);
};

Difractal.SetDrawRate = function(r) {
	Difractal.DrawRate = r;
	clearInterval(Difractal.UpdateID);
	Difractal.Update();
}