module.exports = function(sequelize, DataTypes) {
    var Map = sequelize.define("Map", {
        name: {
            type: DataTypes.STRING(30),
            validate: {
                isAlphanumeric: true
            }
        },
        width_tiles: {
            type: DataTypes.INTEGER(11).UNSIGNED
        },
        height_tiles: {
            type: DataTypes.INTEGER(11).UNSIGNED
        },
        square_size: {
            type: DataTypes.INTEGER(11).UNSIGNED
        }
    }, {
        freezeTableName: true
    });

    return Map;
};
