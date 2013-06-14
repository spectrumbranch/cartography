module.exports = function(sequelize, DataTypes) {
    var Metastate = sequelize.define("Metastate", {
		status:	{
			type: DataTypes.ENUM,
			values: ['active', 'inactive', 'deleted']
		},
        hashkey: DataTypes.STRING(60) //email+salt -> bcrypt@10
    }, {
        freezeTableName: true
    });

    return Metastate;
};