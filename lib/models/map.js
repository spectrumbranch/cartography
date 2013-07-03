module.exports = function(sequelize, DataTypes) {
    var Map = sequelize.define("Map", {
        name: {
			type: DataTypes.STRING(30),
			validate: {
				isAlphanumeric: true
			}
		}
    }, {
        freezeTableName: true
    });

    return Map;
};