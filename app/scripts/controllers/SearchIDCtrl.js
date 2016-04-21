/**
 * Created by sourabhd on 2/10/16.
 */
angular.module('abacuApp')
  .controller('SearchIDCtrl', ['$scope', 'UserData', '$http', 'User', '_', 'Wheelchair', '$location', 'Design', 'ngDialog',
    function ($scope, UserData, $http, User, _, Wheelchair, $location, Design, ngDialog) {
      $scope.currentUser = UserData;
      $scope.searchForm = {
      	searchInput: ''
      };

      // user submitted a search result
      $scope.searchSubmitted = false;

      // searchResult contains response from server for users design id query
      $scope.searchResult = null;

      // design is locked if it is part of the users order history
      function designIsLocked(design) {
        var designID = _.isString(design) ? design : design._id;
        
        var sentOrders = User.getSentOrders();
        return sentOrders.some(function (order) {
          return order.wheelchairs.some(function (lockedDesign) {
            return lockedDesign._id === designID || _.isEqual(lockedDesign, design);
          });
        });
      }

      /**
       * Gets search input from $scope.searchForm.searchInput
       * Queries backend for design that has this id and then renders it
       */
      $scope.search = function () {
      	var input = $scope.searchForm.searchInput.trim();
      	User.fetchDesign(input)
      	.then(function (design) {
      		$scope.searchSubmitted = true;
          if (designIsLocked(design)) {
            return ngDialog.open({
              template: "views/modals/lockedDesignModal.html",
              controller: "LockedDesignModalCtrl"
            }).closePromise
            .then(function (result) {
              if (result.value === 'copy') {
                $scope.searchResult = design.clone(); // clone creates a copy of design without id or revision number
                $scope.editWheelchairDesign();
              } else {
                $scope.searchSubmitted = false;
              }
            });
          } else {
            $scope.searchResult = design;
          }
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
