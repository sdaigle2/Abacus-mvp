/**
 * Created by sourabhd on 2/10/16.
 */
angular.module('abacuApp')
  .controller('SearchIDCtrl', ['$scope', 'UserData', '$http', 'User', '_', 'Wheelchair',
    function ($scope, UserData, $http, User, _, Wheelchair) {
      $scope.currentUser = UserData;
      $scope.searchForm = {
      	searchInput: ''
      };

      // user submitted a search result
      $scope.searchSubmitted = false;

      // searchResult contains response from server for users design id query
      $scope.searchResult = null;

      /**
       * Gets search input from $scope.searchForm.searchInput
       * Queries backend for design that has this id and then renders it
       */
      $scope.search = function () {
      	var input = $scope.searchForm.searchInput.trim();
      	User.fetchDesign(input)
      	.then(function (designWheelchair) {
      		$scope.searchSubmitted = true;
      		$scope.searchResult = designWheelchair;
      	})
      	.catch(function (err) {
      		$scope.searchSubmitted = true;
      		$scope.searchResult = null;
      	});
      	
      };

    }]);
