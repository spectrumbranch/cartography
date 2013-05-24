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
	
	var tileditor = new GameState();
	
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
	Difractal.Master.push(tileditor);
 });