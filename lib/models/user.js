module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        userid: {
			type: DataTypes.STRING(30),
			validate: {
				isAlphanumeric: true
			},
			unique: true
		},
		email: {
			type: DataTypes.STRING(50),
			validate: {
				isEmail: true
			},
			unique: true
		},
		salt: {
			type: DataTypes.STRING(29)
		},
		hash: {
			type: DataTypes.STRING(60)
		}
    }, {
        freezeTableName: true
    });

    return User;
};