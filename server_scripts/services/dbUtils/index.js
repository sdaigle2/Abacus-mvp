/**
 * Provides various helper methods for retrieving Objects with linked fields
 */

var _  = require('lodash');

// Add to this array to add more dbUtils modules
var dbUtilModuleFiles = [
	'./getters',
	'./setters'
];

var dbUtilModules = dbUtilModuleFiles.map(require);

module.exports = dbUtilModules.reduce(function (fullModule, module) {
	return _.merge(fullModule, module);
}, {});