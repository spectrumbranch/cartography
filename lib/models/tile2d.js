module.exports = function(sequelize, DataTypes) {
    var Tile2D = sequelize.define("Tile2D", {
        name: {
			type: DataTypes.STRING(30),
			validate: {
				isAlphanumeric: true
			}
		},
		index: {
			type: DataTypes.INTEGER(11).UNSIGNED
		},
		tileset_id: {
			type: DataTypes.INTEGER(11).UNSIGNED
		},
		tile_id: {
			type: DataTypes.INTEGER(11).UNSIGNED
		}
    }, {
        freezeTableName: true
    });

    return Tile2D;
};