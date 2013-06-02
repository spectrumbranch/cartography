Rough mobile written docs. Will clean up.
-----------------------------------------

Loading tilesets
================

Cartography can load tilesets from AJAX accessible urls. 
The set of available tilesets can be found in ```tilesets.json```. Tilesets.json has a list of ```tilesets``` as an array of name-value pairs of ```tileset_id``` and ```location```. It is important for ```tileset_id``` to be unique and of integer type, and ```location``` can be a url of a ```master.json``` tileset file or its enclosing directory.

The ```master.json file``` describes the tileset and must have matching ```id``` value as searched for ```tileset_id```. It contains a textual ```description``` of the tileset, ```meta_data``` object. There is an array ```tiles``` that holds objects with fields ```tile_id``` and ```img_url``` for the image url relative to the tileset's master.json location. to use as the tile. The ```master.json```defines the standard size of the ```img_url``` sprite.


Example ```tilesets.json``` file:

```
 {
  tilesets: [
		{ 
			tileset_id: 1,
			location: './robots/master.json'
		},
		{
			tileset_id: 2,
			location: './grasslands'
		}
	]
 }

```

Example ```master.json``` file:

```
{
  id: 1,
	description: 'robots tileset',
	meta_data: {
		creator: 'cbebry'
	},
	tiles: [
	{
		tile_id: 0,
		img_url: 'floor.png'
	},
	{
		tile_id: 1,
		img_url: 'structure_topleft_corner.png'
	},
	{
		tile_id: 2,
		img_url: 'structure_top.png'
	},
	{
		tile_id: 3,
		img_url: 'structure_topright_corner.png'
	},
	{
		tile_id: 4,
		img_url: 'structure_left.png'
	},
	{
		tile_id: 5,
		img_url: 'structure_middle.png'
	},
	{
		tile_id: 6,
		img_url: 'structure_right.png'
	},
	{
		tile_id: 7,
		img_url: 'structure_bottomleft_corner.png'
	},
	{
		tile_id: 8,
		img_url: 'structure_bottom.png'
	},
	{
		tile_id: 9,
		img_url: 'structure_bottomright_corner.png'
	}

		
	]
}
```
