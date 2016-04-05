'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:DesignIDModalCtrl
 * @description
 * # DesignIDModalCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
	.controller('DesignIDModalCtrl', ['$scope',
	function ($scope) {
		$scope.copied = false;

		$scope.onCopySuccess = function (e) {
			$scope.copied = true;
		};

		$scope.onCopyFailure = function (e) {
			$scope.copied = false;
		};
	}]);