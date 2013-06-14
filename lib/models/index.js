var Sequelize = require('sequelize');

//console.log("process.env.NODE_ENV: [" + process.env.NODE_ENV + "]");

var database_config_to_use = '';
switch (process.env.NODE_ENV) {
    case 'test_travis':
        database_config_to_use = '../../config/database.test_travis';
        break;
    case undefined:
    case 'production':
    case 'development':
        database_config_to_use = '../../config/database';
        break;
}
var dbconfig = require(database_config_to_use).config;

var dbname = dbconfig.db;
var dbhostname = dbconfig.hostname;
var dbport = dbconfig.port;
var dbuser = dbconfig.user;
var dbpassword = dbconfig.password;

var sequelize = new Sequelize(dbname, dbuser, dbpassword, {
    host: dbhostname,
    port: dbport
});

//list all models that will be loaded
var models = [
    {
        name: "User",
        file: "user"
    },  {
        name: "Metastate",
        file: "metastate"
    }
];

//load models dynamically
models.forEach(function(model) {
    module.exports[model.name] = sequelize.import(__dirname + '/' + model.file); 
});


module.exports.init = function(done) {
	console.log("lib/models/index::init()");
    (function(model) {
        //define all associations
		model.User.hasOne(model.Metastate);
		model.Metastate.belongsTo(model.User);
        
        //ensure tables are created with the fields and associations
        model.User.sync().success(function() {
			model.Metastate.sync().success(function() {
				//callback
				done();
			}).error(function(error) { console.log("Error during Metastate.sync(): " + error); });
        }).error(function(error) { console.log("Error during User.sync(): " + error); });
        
    })(module.exports);
};


//export the connection
module.exports.sequelize = sequelize;