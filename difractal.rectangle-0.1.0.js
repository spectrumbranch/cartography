if (typeof (Difractal) === "undefined") {
	throw new Error("Difractal.Core is required");
}
Difractal.Rectangle = function(x, y, w, h) {
	var fillStyle = "#FFF";
	var lineWidth = 1;
	var strokeStyle = "black";
	var rotation = 0;
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

	return {
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
		SetTextColor: function (n) {
			textcolor = n;
		},
		SetTranslation: function (a, b) {
			translation = {
				x: a,
				y: b
			};
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
		 
			//Note: The following 3 lines should be analyzed
			//for performance
			c.translate(translation.x, translation.y);
			c.rotate(rotation);
			c.scale(scale.x, scale.y);				 			  
			c.rect(0, 0, w, h);
			c.fill();
			if (lineWidth > 0) {
				c.stroke(); 
			}
			c.closePath();
			if (text.length > 0) {
				c.font = font;
				c.fillStyle = textcolor;
				c.textAlign = "center";
				c.fillText(text,w/2,h/2);
			}
			c.restore();
		},
		Contains: function (x_click, y_click) {
			if (x_click >= translation.x && x_click <= scale.x * w + translation.x) {
				if (y_click >= translation.y && y_click <= scale.y * h + translation.y) {
					return true;
				}
			}
			return false;
		},
		Click: function(){
			this.Action();
		},
		Action: function() {
			return false;
		}
	}
}