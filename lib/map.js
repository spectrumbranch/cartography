var internals = {};

internals.data = require('./models');

internals.freshLoadMap = function(input, callback) {
	var Map = internals.data.Map;
	var Tile = internals.data.Tile2D;
	
	if (input.user) {
		Map.create({ name: "blank_slate", width_tiles: 16, height_tiles: 16, square_size: 48 }).success(function(blank_map) {
			blank_map.setUser(input.user).success(function() {
				callback(null, blank_map);
			}).error(function(error) {
				callback(error, null);
			});
		}).error(function(error) {
			callback(error, null);
		});
	} else {
		//user is anonymous -- dont create in db, only show on client side until user registers/logs in
		Map.build({ name: "blank_slate", width_tiles: 16, height_tiles: 16, square_size: 48 }).success(function(blank_map) {
			callback(null, blank_map);
		}).error(function(error) {
			callback(error, null);
		});
	}
}