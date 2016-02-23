'use strict';

/*
 * Exposes lodash variable as its own injectable value
 */
angular.module('abacuApp')
	.factory('_', [function () {
		return window._;
	}]);