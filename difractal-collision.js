		//Collision detection
		
            //Collision detection (mouseclick)
            function RotateClick(x, y, theta, pivot) {
               rot_x = (x - pivot.x) * Math.cos(-theta) - (y - pivot.y) * Math.sin(-theta) + pivot.x;
               rot_y = (x - pivot.x) * Math.sin(-theta) + (y - pivot.y) * Math.cos(-theta) + pivot.y;
               return {
                  x: rot_x,
                  y: rot_y
               };
            }
		var clickDetection = function (e, state, event) {
			//Compatibility for FireFox
			if(typeof e.offsetX === "undefined" || typeof e.offsetY === "undefined") {
				var targetOffset = $(e.target).offset();
				e.offsetX = e.pageX - targetOffset.left;
				e.offsetY = e.pageY - targetOffset.top;
			}

			var _gamestate = (state ? state : Difractal.CurrentState);
			var _entities = _gamestate.GetEntities();
			

			var zindex;
			var index;
			for (var key in _entities) {
			
				var coords = RotateClick(e.offsetX, e.offsetY, _entities[key].GetRotation(), _entities[key].GetRotationPivot());
				if (_entities[key].Contains(coords.x, coords.y)) {
					if (_entities[key].GetZIndex() >= zindex || typeof (index) == "undefined") {
						zindex = _entities[key].GetZIndex();
						index = key;
					}
				}
			}
			if (index) {
				//console.log("Clicked rectangle color: " + _entities[index].GetFillStyle());
				//console.log("Clicked rectangle ID: " + index);
				switch(event) 
				{
					case "click" :
						_entities[index].Click(e);
						break;
					case "mousedown":
						_entities[index].MouseDown(e);
						break;			
				}
			}
			//console.log("X:" + e.offsetX + ", Y: " + e.offsetY);

		};
		
		var mouseMoveDetection = function(e, state) {
			//Compatibility for FireFox
			if(typeof e.offsetX === "undefined" || typeof e.offsetY === "undefined") {
				var targetOffset = $(e.target).offset();
				e.offsetX = e.pageX - targetOffset.left;
				e.offsetY = e.pageY - targetOffset.top;
			}
			
			var _gamestate = (state ? state : Difractal.CurrentState);
			var _entities = _gamestate.GetEntities();
			var zindex;
			var index;
			for (var key in _entities) {
				if (_entities[key].IsMouseDown() || _entities[key].MouseMoveActive) {
					if (_entities[key].GetZIndex() >= zindex || typeof (index) == "undefined") {
						zindex = _entities[key].GetZIndex();
						index = key;
					}
				}
			}
			if (index) {
				//console.log("Clicked rectangle color: " + _entities[index].GetFillStyle());
						_entities[index].MouseMove(e);
				}	
			//console.log("X:" + e.offsetX + ", Y: " + e.offsetY);		
		}
		
		var mouseUpDetection = function(e, state) {
			//Compatibility for FireFox
			if(typeof e.offsetX === "undefined" || typeof e.offsetY === "undefined") {
				var targetOffset = $(e.target).offset();
				e.offsetX = e.pageX - targetOffset.left;
				e.offsetY = e.pageY - targetOffset.top;
			}
			
			var _gamestate = (state ? state : Difractal.CurrentState);
			var _entities = _gamestate.GetEntities();
			var zindex;
			var index;
			for (var key in _entities) {
				if (_entities[key].IsMouseDown()) {
					if (_entities[key].GetZIndex() >= zindex || typeof (index) == "undefined") {
						zindex = _entities[key].GetZIndex();
						index = key;
					}
				}
			}
			if (index) {
				//console.log("Clicked rectangle color: " + _entities[index].GetFillStyle());
						_entities[index].MouseUp(e);
				}
			//console.log("X:" + e.offsetX + ", Y: " + e.offsetY);		
		}		
	
	
   
   //Collision detection between objects!

   /*
  // Profiling shows this is less efficient than CollisionCheck
  
	function CollisionCheck2(obj1, obj2) {
	    if(!CirclePreTest(obj1,obj2)) {
			return false;
		}
		var bounds1 = obj1.GetBounds();
		var bounds2 = obj2.GetBounds();
				
		var vectors1 = obj1.GetVectors();
		var vectors2 = obj2.GetVectors();
							
		for(var i = 0; i < 4; i++) {
		   
			for(var j = 0; j < 4; j++) {
			   var colX = (vectors2[j].b - vectors1[i].b) / (vectors1[j].m - vectors2[i].m)
			   var colY = vectors2[j].m*colX + vectors2[j].b;
			   var pt = {"x" : colX , "y" : colY};
			   if(InBounds(pt,bounds1) && InBounds(pt,bounds2)) {
					return true;
			   }
			}
		}
		return false;

	}	

	*/
	//TODO: Clean up collision checking overall
	function CollisionCheck(obj1,obj2) {

	    if(!CirclePreTest(obj1,obj2)) {
			return false;
		}
	    //Normalize rotation by obj1
		var rot = obj1.GetRotation()*180/Math.PI;
		var pivot = obj1.GetTranslation();
		//Temporarily using the conditional to enable texture2d collision checking
		var coords = [obj1.RotateCorners(-rot,pivot),obj2.RotateCorners(-rot,pivot)];
		//Vectors & bounds for obj2
		var vectors = GetVectors(coords[1]);
		var bounds = [GetBounds(coords[0]),GetBounds(coords[1])];
		var m,b,minY1,maxY1,minX1,maxX1,minY2,maxY2,minX2,maxX2,colX,colY = 0;
		
		for( i = 0; i < 4; i++) {
		     m = vectors[i].m;
			 b = vectors[i].b;
			
			 minY1 = bounds[0].minY;
			 maxY1 = bounds[0].maxY;
			 minX1 = bounds[0].minX;
			 maxX1 = bounds[0].maxX;
			 
			 minY2 = bounds[1].minY;
			 maxY2 = bounds[1].maxY;
			 minX2 = bounds[1].minX;
			 maxX2 = bounds[1].maxX;
			
			
			 colY = m*minX1 + b;
			if(colY >= minY1 && colY <= maxY1 && InBounds({"x" : minX1 , "y" : colY},bounds[1])) {
				//return true;
				return {"x" : minX1 , "y" : colY , "side" : "left"};
			}
			
			colY = m*maxX1 + b;
			if(colY >= minY1 && colY <= maxY1 && InBounds({"x" : maxX1 , "y" : colY},bounds[1])) {
				//return true;
				return {"x" : maxX1 , "y" : colY , "side" : "right"};
			}

			 colX = (minY1 - b) / m;
			if(colX >= minX1 && colX <= maxX1 && InBounds({"x" : colX , "y" : minY1},bounds[1])) {
				//return true;
				return {"x" : colX , "y" : minY1 , "side" : "bottom"};
			}
			colX = (maxY1 - b) / m;
			if(colX >= minX1 && colX <= maxX1 && InBounds({"x" : colX , "y" : maxY1},bounds[1])) {
				//return true;
				return {"x" : colX , "y" : maxY1 , "side" : "top"};
			}
		}
		
	}
	
	function GetBounds(coords) {
		var bounds = {"minX" : Infinity, "minY" : Infinity , "maxX" : -Infinity, "maxY" : -Infinity};
		for(var i = 0; i < 4; i++) {
			if(coords[i].x < bounds.minX) {
				bounds.minX = coords[i].x;
			}
			else if(coords[i].x > bounds.maxX) {
				bounds.maxX = coords[i].x;
			}
			if(coords[i].y < bounds.minY) {
				bounds.minY = coords[i].y;
			}
			else if(coords[i].y > bounds.maxY) {
				bounds.maxY = coords[i].y;
			}	
		}
		return bounds;
	}
	
	function GetVectors(coords) {
		var pt1,pt2,m,b;
		var vectors = [];
		for(var i = 0; i < 4; i++) {
				pt1 = coords[i];
				pt2 = coords[(i+1)%4];
				m = (pt2.y - pt1.y) / (pt2.x - pt1.x);
				b = pt1.y-m*pt1.x;
				vectors.push({"m" : m , "b" : b /*, "pt1" : pt1 , "pt2" : pt2*/});
			}
		return vectors;
	}
	

	function InBounds(pt,bounds) {
		if(pt.x >= bounds.minX && pt.x <= bounds.maxX && pt.y >= bounds.minY && pt.y <= bounds.maxY) {
			return true;
		}
		return false;
	}
	
	function CirclePreTest(obj1,obj2) {
		var center1 = obj1.GetCenter();
		var center2 = obj2.GetCenter();
		var d = Math.pow(center2.y-center1.y,2) + Math.pow(center2.x - center1.x,2);
		if(d <= Math.pow(obj1.GetDimensions().w/2 + obj2.GetDimensions().w/2),2) {
			return true;
		}
		return false;
	}
	
	function GetCornersTexture2D(t2d,rot,pivot) {
		var coords = [];
		var tr = t2d.GetCurrentTranslation();
		var d = t2d.GetCurrentDimensions();
		rot = rot*Math.PI/180;
		coords.push(tr);
		coords.push({"x" : tr.x+(d.width/2) , "y" : tr.y});
		coords.push({"x" : tr.x+(d.width/2) , "y" : tr.y + (d.height/2)});	
		coords.push({"x" : tr.x, "y" : tr.y + (d.height/2)});	
       var rotated = [];
	   for(var i = 0; i < 4; i++) {
			rotated.push({
				"x" : (coords.x - pivot.x)*Math.cos(rot) - (coords.y-pivot.y)*Math.sin(rot) + pivot.x ,
				"y" : (coords.x - pivot.x)*Math.sin(rot) + (coords.y-pivot.y)*Math.cos(rot) + pivot.y			   
			});
	   }
	   return rotated;
  		
	}
		