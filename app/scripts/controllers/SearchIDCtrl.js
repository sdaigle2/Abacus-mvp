/**
 * Created by sourabhd on 2/10/16.
 */
angular.module('abacuApp')
  .controller('SearchIDCtrl', ['$scope', 'UserData', '$http', 'User', '_', 'Wheelchair', '$location', 'Design',
    function ($scope, UserData, $http, User, _, Wheelchair, $location, Design) {
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
      	.then(function (design) {
      		$scope.searchSubmitted = true;
      		$scope.searchResult = design;
      	})
      	.catch(function (err) {
      		$scope.searchSubmitted = true;
      		$scope.searchResult = null;
      	});
      	
      };

      $scope.editWheelchairDesign = function () {
        if ($scope.searchResult) {
          User.createCurrentDesign($scope.searchResult);
          $location.path('/tinker');
        }
      };

      // The results container must always be same width of search container.
      // This is a more 'responsive' solution than setting a static size
      $scope.getWidth = function () {
        return document.getElementById('searchContainer').clientWidth;
      };

      // This is to update the width of the result containers...comment out the $scope.$digest() to see what I mean
      setTimeout(function () {
        $scope.$digest();
      }, 10);

    }]);
