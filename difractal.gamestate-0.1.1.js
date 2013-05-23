/***********************************************************
 *	spectrumbranch.difractal.gamestate-0.1.1
 *		difractal.gamestate represents a canvas screen
 *		model that manages drawable entities
 *
 *		Written by Matt Vegh and Christopher Bebry
 *		Copyright 2012 spectrumbranch
 ***********************************************************/

if (typeof (Difractal) === "undefined") {
	throw new Error("Difractal.Core is required");
}

Difractal.Version.GameState = "0.1.1";
 
function GameState() {
	var entities = [];

	return {
		Add: function(entity) {
			entities.push(entity);
			this.Sort();
		},
		AddRange: function(_entities) {
			var length = _entities.length;
			for (var i = 0; i < length; i++) {
				entities.push(_entities[i]);
			}
			this.Sort();
		},
		Draw: function(ctx) {
			for (var key in entities) {
				entities[key].draw(ctx);
			}
		},
		GetEntities: function() {
			return entities;
		},
		Sort: function() {
			entities.sort(function (obj1, obj2) {
				return obj1.GetZIndex() - obj2.GetZIndex()
			});
		}
	};
}