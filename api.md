Rough mobile written docs. Will clean up.
----
Loading tilesets

Cartography can load tilesets from ajax accessible urls.  The set of available tilesets can be found in tilesets.json. Tilesets.json has a list of tilesets as an array of name-value pairs of tileset_id and location. It is important for tileset_id to be unique and of integer type. Location can be a relative url of a master.json tileset file or its enclosing directory.

The master.json file describes the tileset and must have matching id value as searched for tileset_id. It contains description of tileset and its meta data, as well as an array of tile_id and img_url for the image to use as the tile. The master.json defines the standard size of the img_url sprite.

