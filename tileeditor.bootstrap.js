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
	if(demoSprite.IsMouseDown() && demoSprite.TrackingSprite) {
	   var tr = demoSprite.TrackingSprite.GetTranslation();
	   demoSprite.SetTranslation(tr.x,tr.y);
	   demoSprite.TrackingSprite.SetTranslation(-9999,-9999)
	}
		mouseUpDetection(e,false);
		this.mousedown = false;
		
	}


	tileditor.MouseMoveEvents = function(e) {
		mouseMoveDetection(e,false);
	}	
	

	var width_tiles = 16;
	var height_tiles = 16;
	var square_length = 48;
	
	var CanvasBounds = new Difractal.Entity(0,0,square_length*width_tiles,square_length*height_tiles);
	CanvasBounds.SetZIndex(0);
	tileditor.Add(CanvasBounds);	
	
	
	var tiles = createArray(width_tiles, height_tiles);
	
	for (var i = 0; i < width_tiles; i++) {
		for (var j = 0; j < height_tiles; j++) {
			tiles[i,j] = new Difractal.Entity(i*square_length,j*square_length,square_length,square_length);
			tiles[i,j].SetFillStyle("rgba(255, 0, 255, 0.1)");
			tiles[i,j].SetLineWidth("0");
			//tiles[i,j].SetText("");
			//tiles[i,j].SetTextColor("#000");
			tiles[i,j].Action = function() { };
			tiles[i,j].SetZIndex(2);
			
			
			tileditor.AddRange([tiles[i,j]]);
		}
	}
	
	//This demo sprite is twice the length and width of each tile
	var demoSprite = new Difractal.Entity(0,0,square_length*3,square_length*3);
	demoSprite.SetFillStyle("green");
    demoSprite.SetLineWidth(0);
	demoSprite.SetZIndex(10);
	demoSprite.TrackingSprite = new Difractal.Entity(-9999,-9999,square_length*3,square_length*3);
    demoSprite.TrackingSprite.SetFillStyle("rgba(255, 255, 0, 0.5)");
    demoSprite.TrackingSprite.SetLineWidth(0);
	demoSprite.TrackingSprite.SetZIndex(9);
	
	demoSprite.MouseMove = function(e) {
		if(this.IsMouseDown()) {
	
			this.lastX = this.curX;
			this.curX = e.offsetX;
			this.lastY = this.curY;
			this.curY = e.offsetY;	

			var tr = this.GetTranslation();
			var trX = e.offsetX - (this.relativeMDX);
			var trY = e.offsetY - (this.relativeMDY);

			if(trX < 0) {
				trX = 0;
			} 
			else if(trX + this.GetDimensions().w > square_length*width_tiles) {
				trX = square_length*width_tiles - this.GetDimensions().w;
			} 
			
			if(trY < 0) {
				trY = 0;
			} 
			else if(trY + this.GetDimensions().h > square_length*height_tiles) {
				trY = square_length*height_tiles - this.GetDimensions().h;
			}		

			
			this.SetTranslation(trX,trY);
			 
           		
			
		   var _entities = Difractal.CurrentState.GetEntities();
           var checkPT = {"x" : this.relativeMDX + trX, "y" : this.relativeMDY + trY };
		   
		   for(var y in _entities) {
		     var x = _entities[y];
			 var adjusted = false;
		      if(x != this) {
					if(x.Contains(checkPT.x,checkPT.y)) {
					 var tr = x.GetTranslation();
					 var trX = tr.x;
					 var trY = tr.y;

					if(tr.x + demoSprite.GetDimensions().w > width_tiles*square_length ) {
					   trX = width_tiles*square_length - demoSprite.GetDimensions().w;
					} 
					else if(demoSprite.GetTranslation().x == 0) {
					   trX = 0;
					}
										 
					if(tr.y + demoSprite.GetDimensions().h > height_tiles*square_length) {
					    trY = height_tiles*square_length - demoSprite.GetDimensions().h
				     }
					else if(demoSprite.GetTranslation().y == 0) {
					   trY = 0;
					}
 
					 demoSprite.TrackingSprite.SetTranslation(trX,trY);
					 

				  } 
			  }
		   }
		
			
			
		}
	}	
	
	tileditor.Add(demoSprite);
	tileditor.Add(demoSprite.TrackingSprite);
	

	
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