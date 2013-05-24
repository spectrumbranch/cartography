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


Difractal.Master.Pop = function () {
	this.pop();
	var index = this.length-1;
	Difractal.CurrentState = this[index];
}

Difractal.Master.Push = function (state) {
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

//Update Loop

Difractal.Update = function () {
	Difractal.UpdateID = setInterval(function () {
		Difractal.Draw();
		Difractal.CurrentState.Events();
	}, Difractal.DrawRate);
};

Difractal.SetDrawRate = function(r) {
	Difractal.DrawRate = r;
	clearInterval(Difractal.UpdateID);
	Difractal.Update();
}

Difractal.Timer = function()
{
 return {
    start: -1,
	end: -1,
	Start: function() {
		if(this.start == -1) {
			this.start = new Date().getTime();
			this.end = -1;
			return this.start;
		}
       return false;
	},
	Stop: function() {
		if(this.start != -1 && this.end == -1) {
			this.end = new Date().getTime();
			return this.end;
		}
        return false;
	},
	GetElapsedInterval: function() {
		if(this.start != -1 && this.end == -1) { 
			var current = new Date().getTime();
			return current - this.start;
		}
		return -1;
	},
	GetElapsedTime: function() {
		if(this.start != -1 && this.end != -1) {
			return this.end-this.start;
		}
		return -1;
	},

	Reset: function() {
		this.start = -1;
		this.end = -1;
	}
   }
}
