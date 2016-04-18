'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:DesignIDModalCtrl
 * @description
 * # DesignIDModalCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
	.controller('DesignIDModalCtrl', ['$scope', '$location',
	function ($scope, $location) {
		$scope.copied = false;

		$scope.onCopySuccess = function (e) {
			$scope.copied = true;
		};

		$scope.onCopyFailure = function (e) {
			$scope.copied = false;
		};

		$scope.getTinkerLink = function (designID) {
			var baseURL = _.trimEnd($location.absUrl(), $location.path());
			return baseURL + '/tinker/' + designID;
		};
	}]);