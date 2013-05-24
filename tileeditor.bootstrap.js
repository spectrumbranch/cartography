/*Tricky but awesome function found on stack overflow*/
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

$(document).ready(function () {
	Difractal.CanvasRef = document.getElementById("canvas");
	Difractal.Context = Difractal.CanvasRef.getContext("2d");
	
	var tileditor = new Difractal.GameState();
	
	tileditor.mousedown = false;
	tileditor.MouseDownEvents = function(e) {
		clickDetection(e,false,"mousedown");
		this.mousedown = true;
}
	tileditor.MouseUpEvents = function(e) {
		mouseUpDetection(e,false);
		this.mousedown = false;
	}


	tileditor.MouseMoveEvents = function(e) {
		mouseMoveDetection(e,false);
	}	
	
	var width_tiles = 16;
	var height_tiles = 16;
	var square_length = 48;
	
	var tiles = createArray(width_tiles, height_tiles);
	
	for (var i = 0; i < width_tiles; i++) {
		for (var j = 0; j < height_tiles; j++) {
			tiles[i,j] = new Difractal.Entity(i*square_length,j*square_length,square_length,square_length);
			tiles[i,j].SetFillStyle("rgba(255, 0, 255, 0.1)");
			tiles[i,j].SetLineWidth("0");
			//tiles[i,j].SetText("");
			//tiles[i,j].SetTextColor("#000");
			tiles[i,j].Action = function() { };
			
			
			tileditor.AddRange([tiles[i,j]]);
		}
	}
	
	var demoSprite = new Difractal.Entity(0,0,square_length,square_length);
	demoSprite.SetFillStyle("green");
    demoSprite.SetLineWidth(0);
	demoSprite.SetZIndex(10);
	demoSprite.MouseMove = function(e) {
		if(this.IsMouseDown()) {
			this.lastX = this.curX;
			this.curX = e.offsetX;
			this.lastY = this.curY;
			this.curY = e.offsetY;
			
			var tr = this.GetTranslation();
			var trX = tr.x+this.curX-this.lastX;
			var trY = tr.y+this.curY-this.lastY;
			if(trX < 0) {
				trX = 0;
			} 
			else if(trX > Difractal.CanvasRef.width) {
				trX = Difractal.CanvasRef.width;
			}
			if(trY < 0) {
				trY = 0;
			} 
			else if(trY > Difractal.CanvasRef.height) {
				trY = Difractal.CanvasRef.height;
			}

			this.SetTranslation(trX, trY);
			
			

		   var _entities = Difractal.CurrentState.GetEntities();
		   for(var y in _entities) {
		     var x = _entities[y];
		      if(x != this) {
					if(x.Contains(e.offsetX,e.offsetY)) {
					 x.SetFillStyle("yellow");
				  } else {
					 x.SetFillStyle("rgba(255, 0, 255, 0.1)");
				  }
			  }
		   }
				
			
			
		}
	}	
	
	tileditor.Add(demoSprite);
	
	
	Difractal.Master.Push(tileditor);

 });
 
 $(document).ready(function(){
 
 /////////////////////////////////////////////////////////////////////////	
	//Global Listeners

	var keys = [];

	$(document).keyup(function(e) {
		delete keys[e.which];
	});
	$(document).keydown(function(e) {
		keys[e.which] = true;
		Difractal.CurrentState.KeyDownEvents(e);
		e.preventDefault();
	});	
	
	$("#canvas").click(function(e){
		Difractal.CurrentState.ClickEvents(e);	
	});
	
	$("#canvas").mousedown(function(e){
		Difractal.CurrentState.MouseDownEvents(e);
	});
	
	$(document).mouseup(function(e){
		Difractal.CurrentState.MouseUpEvents(e);
	});	
	
	$(document).mousemove(function(e){
		Difractal.CurrentState.MouseMoveEvents(e);
	});	
	
	$("#controls").click(function(e){
		clickDetection(e, battlescreen.controls, "click");
	});
	
/////////////////////////////////////////////////////////////////////////////
 Difractal.Update();
 });