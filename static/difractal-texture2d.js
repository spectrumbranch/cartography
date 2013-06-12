Difractal.Texture2D = function (src, origin) {
	var img = new Image();
	var imgsrc = src;
	img.src = imgsrc;
	var translation = {"x": origin.x,"y": origin.y};
	var rotation = 0;
	var scale = {"x": 1 , "y" : 1};
	var zindex = 1;
	var dimensions;
	img.onload = function() {
		dimensions = { "width": img.width, "height": img.height};
	};
	var mode = "full";
	var mousedown = false;

	return {
		SetSrc: function (src) {
			imgsrc = src;
			img.src = imgsrc;
		},
		SetMode: function (n) {
			mode = n;
		},
		SetMousedown: function (bool) {
			mousedown = bool;
		},
		SetDimensions: function (_dimensions) {
			dimensions = _dimensions;
		},
		SetTranslation: function (x,y) {
			translation = {"x" : x , "y" : y};
		},
		SetScale: function (_scale) {
			scale = _scale;
		},
		SetZIndex: function (n) {
			zindex = n;
		},
		GetScale: function() {
		   return scale;
		},
		SetRotation: function (theta) {
			rotation = theta*Math.PI/180;
		},
		GetRotation: function () {
			return rotation;
		},
		//todo: make this dynamic (topleft, center, etc)
		GetRotationPivot: function () {
		   return this.GetCenter();
		},
		GetDimensions: function () {
			return dimensions;
		},
		GetTranslation: function () {
			return translation;
		},
		GetCurrentTranslation: function () {
			return {"x" : Difractal.scale.x*translation.x + Difractal.translation.x , "y" : Difractal.scale.y*translation.y + Difractal.translation.y };
		},
		GetCurrentTranslation_X: function () {
			return Difractal.scale.x*translation.x + Difractal.translation.x;
		},
		GetCurrentTranslation_Y: function() {
			return Difractal.scale.y*translation.y + Difractal.translation.y;
		},
		IsMouseDown: function () {
			return mousedown;
		},
		GetCurrentWidth: function () {
			return dimensions.width*Difractal.scale.x*scale.x;
		},
		GetCurrentHeight: function () {
			return dimensions.height*Difractal.scale.y*scale.y;
		},
		GetSrc: function () {
			return imgsrc;
		},
		GetMode: function () {
			return mode;
		},
		GetSourceWidth: function () {
			return img.width;
		},
		GetSourceHeight: function () {
			return img.height;
		},
		GetCenter: function () {
			return {
				"x": this.GetCurrentTranslation_X() + this.GetCurrentWidth() / 2,
				"y": this.GetCurrentTranslation_Y() +  this.GetCurrentHeight() / 2
			};
		},
		GetZIndex: function() {
			return zindex;
		},
		GetImage: function () {
			return img;
		},
		GetImageData: function(ctx) {
		return  ctx.GetImageData(translation.x, translation.y, dimensions.width, dimensions.height);
		},
		GetPixelData: function(ctx, x , y) {
			 var imageData = this.GetImageData(Master.ctx);
			 var index = (x + y * imageData.width) * 4;
			return {
				"r": imageData.data[index+0],
				"g": imageData.data[index+1],
				"b": imageData.data[index+2],
				"a": imageData.data[index+3]
			}
		},
		SetPixelData: function(imageData,x, y, r, g, b, a) {
			//var imageData = this.GetImageData(ctx);
			index = (x + y * imageData.width) * 4;
			imageData.data[index+0] = r;
			imageData.data[index+1] = g;
			imageData.data[index+2] = b;
			imageData.data[index+3] = a;
		},
		CenterImage: function () {
			translation.x = (Master.CanvasCenter().x - Difractal.translation.x - this.GetCurrentWidth()/2)/Difractal.scale.x;
			translation.y = (Master.CanvasCenter().y - Difractal.translation.y - this.GetCurrentHeight()/2)/Difractal.scale.y;
		},
		draw: function (ctx) {
			ctx.save();
			ctx.translate(this.GetCurrentTranslation_X() + this.GetCurrentWidth()/2, this.GetCurrentTranslation_Y() + this.GetCurrentHeight()/2);
			ctx.rotate(rotation);
			ctx.translate(-(this.GetCurrentTranslation_X() + this.GetCurrentWidth()/2), -(this.GetCurrentTranslation_Y() + this.GetCurrentHeight()/2));
			ctx.translate(Difractal.translation.x,Difractal.translation.y);	
			ctx.scale(Difractal.scale.x,Difractal.scale.y);	
			ctx.translate(translation.x,translation.y);			
			ctx.scale(scale.x,scale.y);
			ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);
			ctx.restore();
		},
		Contains: function (x_click, y_click) {
			if (x_click >= this.GetCurrentTranslation_X() && x_click <= this.GetCurrentWidth() + this.GetCurrentTranslation_X()) {
				if (y_click >= this.GetCurrentTranslation_Y() && y_click <= this.GetCurrentHeight() + this.GetCurrentTranslation_Y()) {
					return true;
				}
			}
			return false;
		},
		Click: function(params) {
			this.Action(params);
		},
		Action: function() {
			return false;
		}
	}
}

