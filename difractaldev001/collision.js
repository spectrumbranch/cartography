//Collision detection

//TODO: Add this to the framework

if (typeof (Difractal) === "undefined") {
	throw new Error("Difractal.Core is required");
}

Difractal.RotateClick = function(x, y, theta, translation) {
	var rot_x = (x - translation.x) * Math.cos(-theta) - (y - translation.y) * Math.sin(-theta) + translation.x;
	var rot_y = (x - translation.x) * Math.sin(-theta) + (y - translation.y) * Math.cos(-theta) + translation.y;
	console.log("Rotated-X: " + rot_x + ", Rotated-Y: " + rot_y);
	return {
		x: rot_x,
		y: rot_y
	};
}

$(document).ready(function() {
	//TODO: consider making this click function based off the id of the canvas which has already been established (ex: Difractal.canvasID)
	$("#difractaldev001").click(function (e) {
		//Compatibility for FireFox
		if (typeof e.offsetX === "undefined" || typeof e.offsetY === "undefined") {
			var targetOffset = $(e.target).offset();
			e.offsetX = e.pageX - targetOffset.left;
			e.offsetY = e.pageY - targetOffset.top;
		}
		var length = Difractal.Master.length;
		var _gamestate = Difractal.Master[length-1];
		var _entities = _gamestate.GetEntities();
		var zindex;
		var index;
		for (var key in _entities) {
			var coords = Difractal.RotateClick(e.offsetX, e.offsetY, _entities[key].GetRotation(), _entities[key].GetTranslation());
			if (_entities[key].Contains(coords.x, coords.y)) {
				if (_entities[key].GetZIndex() >= zindex || typeof (index) === "undefined") {
					zindex = _entities[key].GetZIndex();
					index = key;
				}
			}
		}
		if (index >= 0) {
			console.log("Clicked rectangle color: " + _entities[index].GetFillStyle());
			_entities[index].Click();
		}
		console.log("X:" + e.offsetX + ", Y: " + e.offsetY);
	});
});