if (typeof (Difractal) === "undefined") {
	throw new Error("Difractal.Core is required");
}
Difractal.Entity = function(x, y, w, h) {
	var fillStyle = "#FFF";
	var lineWidth = 1;
	var strokeStyle = "black";
	var rotation = 0;
	var rotateStyle = "center";
	var scale = {
	   x: 1,
	   y: 1
	};
	var translation = {
	   x: x,
	   y: y
	};
	var zindex = 1;
	var dimensions = {
	   w: w,
	   h: h
	};
	var text = "";
	var textcolor = "#000";
	var font = "18px Arial";
	var multiline = false;
	
	var mousedown = false;
	
	return {
		GetBounds: function() {
			var bounds = {"minX" : Infinity, "minY" : Infinity , "maxX" : -Infinity, "maxY" : -Infinity};
			var coords = this.GetCorners();
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
		},
	//Todo: include scale
	   GetCenter: function () {
			 var center = {"x" : translation.x + dimensions.w/2 , "y" : translation.y + dimensions.h/2};
			if(rotateStyle == "center") {
				return center;
			}
			else if(rotateStyle == "topleft") {
				var x2 = (center.x-translation.x)*Math.cos(rotation) - (center.y-translation.y)*Math.sin(rotation) + translation.x;
				var y2 = (center.x-translation.x)*Math.sin(rotation) + (center.y-translation.y)*Math.cos(rotation) + translation.y;
				return {"x" : x2 , "y" : y2}
			}
	   },
	   GetCorners: function () { 
		var corners = [];
		var pivot = this.GetRotationPivot();
			corners.push({
				"x" : (translation.x - pivot.x)*Math.cos(rotation) - (translation.y-pivot.y)*Math.sin(rotation) + pivot.x ,
				"y" : (translation.x - pivot.x)*Math.sin(rotation) + (translation.y-pivot.y)*Math.cos(rotation) + pivot.y
			});
			corners.push({
				"x" : (translation.x + dimensions.w - pivot.x)*Math.cos(rotation) - (translation.y-pivot.y)*Math.sin(rotation) + pivot.x ,
				"y" : (translation.x + dimensions.w - pivot.x)*Math.sin(rotation) + (translation.y-pivot.y)*Math.cos(rotation) + pivot.y
			});
			corners.push({
				"x" : (translation.x + dimensions.w - pivot.x)*Math.cos(rotation) - (translation.y + dimensions.h -pivot.y)*Math.sin(rotation) + pivot.x ,
				"y" : (translation.x + dimensions.w - pivot.x)*Math.sin(rotation) + (translation.y + dimensions.h -pivot.y)*Math.cos(rotation) + pivot.y
			});
			corners.push({
				"x" : (translation.x - pivot.x)*Math.cos(rotation) - (translation.y + dimensions.h -pivot.y)*Math.sin(rotation) + pivot.x ,
				"y" : (translation.x - pivot.x)*Math.sin(rotation) + (translation.y + dimensions.h -pivot.y)*Math.cos(rotation) + pivot.y
			});
			return corners;
			
	   },
	   RotateCorners: function(theta,pivot) {
			var corners = this.GetCorners();
			if(!pivot){pivot = this.GetRotationPivot()};
			theta = theta*Math.PI/180;
			var rotated = [];
			for(var i = 0; i < 4 ; i++) {
				rotated.push({
					"x" : (corners[i].x - pivot.x)*Math.cos(theta) - (corners[i].y - pivot.y)*Math.sin(theta) + pivot.x,
					"y" : (corners[i].x - pivot.x)*Math.sin(theta) + (corners[i].y - pivot.y)*Math.cos(theta) + pivot.y
				});
			}
			return rotated;
	   
	   },
	   GetDimensions: function () {
		  return dimensions;
	   },
	   GetFillStyle: function () {
		  return fillStyle;
	   },
	   GetFont: function(){
		  return font;
	   },
	   GetLineWidth: function () {
		  return lineWidth;
	   },
	   GetRotation: function () {
		  return rotation;
	   },
	   GetRotationPivot: function () {
		if(rotateStyle == "center") {
			return this.GetCenter();
		}
		else if(rotateStyle == "topleft") {
			return translation;
		}
	   },
	   GetScale: function () {
		  return scale;
	   },
	   GetStrokeStyle: function () {
		  return strokeStyle;
	   },
	   GetText: function () {
		  return text;
	   },
	   GetTextColor: function () {
		  return textcolor;
	   },
	   GetTranslation: function () {
		  return translation;
	   },
	   GetVectors: function() {
			var coords = this.GetCorners();
			var pt1,pt2,m,b;
			var vectors = [];
			for(var i = 0; i < 4; i++) {
				pt1 = coords[i];
				pt2 = coords[(i+1)%4];
				m = (pt2.y - pt1.y) / (pt2.x - pt1.x);
				b = pt1.y-m*pt1.x;
				vectors.push({"m" : m , "b" : b , "pt1" : pt1 , "pt2" : pt2});
			}
			return vectors;
	   },
	   GetZIndex: function () {
		  return zindex;
	   },
	   SetFillStyle: function (n) {
		  fillStyle = n;
	   },
	   SetFont: function(n){
		 font = n;
	   },
	   SetLineWidth: function (n) {
		  lineWidth = n;
	   },
	   SetRotation: function (n) {
		  rotation = n * Math.PI / 180;
	   },
	   SetRotationStyle: function(n) {
		rotateStyle = n; 
	   },
	   SetScale: function (a, b) {
		  scale = {
			 x: a,
			 y: b
		  };
	   },
	   SetStrokeStyle: function (n) {
		  strokeStyle = n;
	   },
	   SetText: function (n) {
		  text = n;
	   },
	   SetMultiline: function (n) {
		  multiline = n;
	   },
	   SetTextColor: function (n) {
		  textcolor = n;
	   },
	   SetTranslation: function (a, b) {
		  translation = {
			 x: a,
			 y: b
		  };
	   },
	   SetTranslationX: function (n) {
	      translation.x = n;
	   },
	   SetTranslationY: function (n) {
	      translation.y = n;
	   },
	   SetZIndex: function (n) {
		  zindex = n;
	   },
	   draw: function (c) {
		  c.save();
		  c.beginPath();
		  c.fillStyle = fillStyle;
		  c.lineWidth = lineWidth;
		  c.strokeStyle = strokeStyle;
		 
		 if(rotateStyle == "center") {
			  c.translate(translation.x + w/2, translation.y + h/2);
			  c.rotate(rotation);
			  c.translate(-(translation.x + w/2), -(translation.y + h/2));	
		  } else if(rotateStyle == "topleft"){
		    c.translate(translation.x, translation.y);
			c.rotate(rotation);  
			c.translate(-translation.x, -translation.y);
		  }
		  else {
		 	c.rotate(rotation);   
		  }
		  
		  c.translate(translation.x, translation.y);
		  c.scale(scale.x, scale.y);				 			  
		  c.rect(0, 0, w, h);
		  c.fill();
		  if(lineWidth > 0) {
			c.stroke(); 
		  }
		  c.closePath();
		  if(text.length > 0){
		     if(multiline) {
			   var explode = text.split("\n");
			   var lineheight = 0;
			   for(var x in explode) {
					c.font = font;
					c.fillStyle = textcolor;
					c.textAlign = "center";
					c.fillText(explode[x],w/2,h/2 + lineheight);
					lineheight+=25;
				}
			 } else {
			c.font = font;
			c.fillStyle = textcolor;
			c.textAlign = "center";
			c.fillText(text,w/2,h/2);
			}
		  }
		  c.restore();
	   },
	   Contains: function (x_click, y_click) {
		  if(x_click >= translation.x && x_click <= scale.x * w + translation.x) {
			 if(y_click >= translation.y && y_click <= scale.y * h + translation.y) {
				return true;
			 }
		  }
		  return false;
	   },
	   IsMouseDown: function() {
			return mousedown;
	   },
	  Click: function(params){
		this.Action(params);
	  },
	  Action: function(){return false;},
	  MouseDown: function(e) {
		 mousedown = true;
		 this.lastX = e.pageX;
		 this.lastY = e.pageY;
		 this.curX = e.pageX;
		 this.curY = e.pageY;
		 this.mdX = e.pageX;
		 this.mdY = e.pageY;
		 
		 this.relativeMDX = e.offsetX - translation.x;
		 this.relativeMDY = e.offsetY - translation.y;
		 
		 this.relativeMDX2 = e.pageX - translation.x;
		 this.relativeMDY2 = e.pageY - translation.y;
		 
		 this.maskTrX = translation.x;
		 this.maskTrY = translation.y;
	  },
	  MouseUp: function() {
		mousedown = false;
	  },
	  MouseMove: function() {
		 return false;
	  }
	}
}