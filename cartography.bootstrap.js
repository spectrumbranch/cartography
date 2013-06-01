if (typeof (Cartography) === "undefined") {
	throw new Error("Cartography core is required");
}

$(document).ready(function () {
	var cnv = Cartography.Config.canvas;
	Difractal.AddCanvas(cnv);
	
	Cartography.TiledMap = new Difractal.GameState();
	Cartography.TiledMap.CanvasObject = Difractal.Canvases[cnv];
	
	Cartography.TiledMap.mousedown = false;
	Cartography.TiledMap.MouseDownEvents = function(e) {
		clickDetection(e,this,"mousedown");
		this.mousedown = true;
	}
	Cartography.TiledMap.MouseMoveEvents = function(e) {
		mouseMoveDetection(e,this);
	}
	
	//"Configurables"
	var square_length = Cartography.Config.tile_side_length;
	
	var width_tiles = Cartography.Config.map_width_tiles;
	var height_tiles = Cartography.Config.map_height_tiles;
	
	var map_origin = new Difractal.Vector2D(0,0);
	
	var palette_width_tiles = Cartography.Config.palette_width_tiles;
	var palette_height_tiles = Cartography.Config.palette_height_tiles;

	var palette_origin = new Difractal.Vector2D(800,0);

	Cartography.MapBounds = new Difractal.Entity(map_origin.x,map_origin.y,square_length*width_tiles,square_length*height_tiles);
	Cartography.MapBounds.SetZIndex(0);
	Cartography.TiledMap.Add(Cartography.MapBounds);
	
	Cartography.PaletteBounds = new Difractal.Entity(palette_origin.x,palette_origin.y,square_length*palette_width_tiles,square_length*palette_height_tiles);
	Cartography.PaletteBounds.SetZIndex(0);
	Cartography.TiledMap.Add(Cartography.PaletteBounds);
	
	var CanvasBounds = new Difractal.Entity(0,0,palette_origin.x + square_length*palette_width_tiles, palette_origin.y + square_length*palette_height_tiles);
	CanvasBounds.SetLineWidth(0);
	Cartography.TiledMap.Add(CanvasBounds);
	
	//Create tile editor map portion, calculated to be 768px at current config
	var tiles = Cartography.createArray(width_tiles, height_tiles);
	var _tiles = [];
	for (var i = 0; i < width_tiles; i++) {
		for (var j = 0; j < height_tiles; j++) {
			tiles[i,j] = new Difractal.Entity(map_origin.x+i*square_length,map_origin.y+j*square_length,square_length,square_length);
			tiles[i,j].SetFillStyle("rgba(255, 0, 255, 0.1)");
			tiles[i,j].SetLineWidth("0");
			tiles[i,j].Action = function() { };
			tiles[i,j].SetZIndex(2);
			
			_tiles.push(tiles[i,j]);
			Cartography.TiledMap.AddRange([tiles[i,j]]);
		}
	}
	//Create tile editor palette potion
	var paletteTiles = Cartography.createArray(palette_width_tiles, palette_height_tiles);
	for (var i = 0; i < palette_width_tiles; i++) {
		for (var j = 0; j < palette_height_tiles; j++) {
			paletteTiles[i,j] = new Difractal.Entity(palette_origin.x+i*square_length,palette_origin.y+j*square_length,square_length,square_length);
			paletteTiles[i,j].SetFillStyle("rgba(0, 0, 255, 0.2)");
			paletteTiles[i,j].SetLineWidth("0");
			paletteTiles[i,j].Action = function() { };
			paletteTiles[i,j].SetZIndex(2);
			
			Cartography.TiledMap.AddRange([paletteTiles[i,j]]);
		}
	}
	

	//Create selector and its snap
	var tileSelectorScale = 1; //TODO: attach this sort of thing to a slider control
	var tileSelectorHeight = square_length * tileSelectorScale;
	var tileSelectorWidth = square_length * tileSelectorScale;
	
	var SelectorSprite = new Difractal.Entity(palette_origin.x,palette_origin.y,tileSelectorWidth,tileSelectorHeight);
	SelectorSprite.SetFillStyle("rgba(0, 255, 0, 0.3)");
    SelectorSprite.SetLineWidth(0);
	SelectorSprite.SetZIndex(10);
	SelectorSprite.TileSnapSprite = new Difractal.Entity(-9999,-9999,tileSelectorWidth,tileSelectorHeight);
    SelectorSprite.TileSnapSprite.SetFillStyle("rgba(125, 125, 255, 0.5)");
    SelectorSprite.TileSnapSprite.SetLineWidth(0);
	SelectorSprite.TileSnapSprite.SetZIndex(9);
	
	SelectorSprite.MouseMove = function(e) {
		if (this.IsMouseDown()) {
			this.lastX = this.curX;
			this.curX = e.pageX;
			this.lastY = this.curY;
			this.curY = e.pageY;

			var tr = this.GetTranslation();
			var trX = e.pageX - (this.relativeMDX2);
			var trY = e.pageY - (this.relativeMDY2);

			if (trX < 0) {
				trX = 0;
			} else if (trX + this.GetDimensions().w >= CanvasBounds.GetTranslation().x + CanvasBounds.GetDimensions().w) {
				trX = CanvasBounds.GetTranslation().x + CanvasBounds.GetDimensions().w - this.GetDimensions().w;
			} 
			
			if (trY < 0) {
				trY = 0;
			} else if (trY + this.GetDimensions().h > CanvasBounds.GetTranslation().y + CanvasBounds.GetDimensions().h) {
				trY = CanvasBounds.GetTranslation().y + CanvasBounds.GetDimensions().h;
			}		

			this.SetTranslation(trX,trY);

			var checkPT = {"x" : this.relativeMDX + trX, "y" : this.relativeMDY + trY };

		  var corners = SelectorSprite.GetCorners();
		  var onmap = false;
		   for(var index in corners) {
		     var pt = corners[index];
		      if(Cartography.MapBounds.Contains(pt.x,pt.y)) {
                  onmap = true;
                  break;				  
			  }
		   }
		   if(!onmap) {
			  SelectorSprite.TileSnapSprite.SetTranslation(-9999,-9999);
		      return;
		   }
		   
			for(var y in _tiles) {
				var x = _tiles[y];
				if (x != this) {

					if (x.Contains(checkPT.x,checkPT.y)) {
						var tr = x.GetTranslation();
						var trX = tr.x;
						var trY = tr.y;

						if (tr.x + SelectorSprite.GetDimensions().w > width_tiles*square_length) {
							trX = width_tiles*square_length - SelectorSprite.GetDimensions().w;
						} else if (SelectorSprite.GetTranslation().x == 0) {
							trX = 0;
						}

						if (tr.y + SelectorSprite.GetDimensions().h > height_tiles*square_length) {
							trY = height_tiles*square_length - SelectorSprite.GetDimensions().h;
						} else if (SelectorSprite.GetTranslation().y == 0) {
						   trY = 0;
						}
						SelectorSprite.TileSnapSprite.SetTranslation(trX,trY);
					} 
				}
			}
		}
	}
	Cartography.TiledMap.MouseUpEvents = function(e) {
		if (SelectorSprite.IsMouseDown() && SelectorSprite.TileSnapSprite){
		  var corners = SelectorSprite.GetCorners();
		  var fulfill = false;
		   for(var index in corners) {
		     var pt = corners[index];
		      if(Cartography.MapBounds.Contains(pt.x,pt.y)) {
                  fulfill = true;
                  break;				  
			  }
		   }
		   if(fulfill) {
			var tr = SelectorSprite.TileSnapSprite.GetTranslation();
		    SelectorSprite.TileSnapSprite.SetTranslation(-9999,-9999)		
			SelectorSprite.SetTranslation(tr.x,tr.y);
			} else {
			
				  SelectorSprite.TileSnapSprite.SetTranslation(-9999,-9999)		
			      SelectorSprite.SetTranslation(palette_origin.x,palette_origin.y);				
			}

		}
		mouseUpDetection(e,this);
		this.mousedown = false;
	}
	
	Cartography.TiledMap.Add(SelectorSprite);
	Cartography.TiledMap.Add(SelectorSprite.TileSnapSprite);
	Difractal.Canvases[cnv].Master.Push(Cartography.TiledMap);

	Difractal.Start();
 });