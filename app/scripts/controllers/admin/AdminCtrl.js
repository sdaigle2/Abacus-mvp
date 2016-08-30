'use strict';

angular.module('abacuApp')
  .controller('AdminCtrl', ['$scope', '$location', 'User', '_', 'AdminAPI',  function ($scope, $location, User, _, AdminAPI) {

  	function validateFields(obj) {
  		if (!obj.startDate || !obj.endDate || !obj.id || !obj.percent) return 'Please fill in all the fields.'
		if (typeof obj.id !== 'string') return 'Id should be a string.'
		if (isNaN(obj.percent)) return 'Percent should be a number.'
		return '';
  	};

	$scope.clear = function() {
		$scope.discount = {};
		$scope.errorMsg = '';
	};

	$scope.open1 = function() {
		$scope.popup1.opened = true;
	};

	$scope.open2 = function() {
		$scope.popup2.opened = true;
	};
	$scope.discount = {};

	$scope.format = 'dd-MMMM-yyyy';

	$scope.popup1 = {
		opened: false
	};

	$scope.popup2 = {
		opened: false
	};

	$scope.errorMsg = '';

	$scope.submitDiscount = function() {
		$scope.errorMsg = validateFields($scope.discount);
		if (!$scope.errorMsg)  {
			$scope.discount.percent = $scope.discount.percent / 100;
			$scope.errorMsg = '';
			
			AdminAPI.createDiscount($scope.discount)
			.then(function() {
				$scope.successMsg = 'Discount successfully created.';
				$scope.discount = {};
			});
		}
	};

}]);
