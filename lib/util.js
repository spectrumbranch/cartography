var packageInfo = require('../package.json');

exports.version = packageInfo.version;


var internals = {};
 
exports.CheckTypeOf = internals.CheckTypeOf = {};

internals.CheckTypeOf.IsArray = function(input) {
	var isArray = false;
	if (Object.prototype.toString.call(input) === '[object Array]') {
		isArray = true;
	}
	return isArray;
}

internals.CheckTypeOf.IsString = function(input) {
	var isString = false;
	if (typeof someVar === 'string') {
		isString = true;
	}
	return isString;
}

internals.CheckTypeOf.GetArrayFromString = function(input) {
	var output = [];
	console.log("internals.CheckTypeOf.GetArrayFromString:input:: "+ input);
	if (internals.CheckTypeOf.IsArray(input)) {
		output = input;
	} else if (internals.CheckTypeOf.IsString()) {
		output = [input];
	}
	console.log("internals.CheckTypeOf.GetArrayFromString:output:: "+ output);
	return output;
}