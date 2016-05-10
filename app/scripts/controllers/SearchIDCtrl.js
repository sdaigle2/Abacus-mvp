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

      /**
       * Searches through all user attributes to find a particular design (indexed by design ID)
       * Returns the design if its found, otherwise returns undefined
       * @param design
       * @returns {Design|undefined}
         */
      function findDesignInUser(design) {
        var findDesignInArray = function (designs) {
          return _.find(designs, {_id: design._id});
        };

        var findDesignInOrder = function (order) {
          return findDesignInArray(order.wheelchairs);
        };

        return findDesignInArray(User.getSavedDesigns()) ||
          findDesignInOrder(User.getCart()) ||
          _.find(User.getAllOrders(), findDesignInOrder);
      }

      $scope.editWheelchairDesign = function () {
        if ($scope.searchResult) {
          User.createCurrentDesign($scope.searchResult)
            .then(function () {
              // If the user searched up one of their own designs, then the call to User.createCurrentDesign would have updated the revision number for it
              // The following code finds out whether the searched design belongs to the user, and if so,
              // attaches the latest revision number to the currentEditWheelchair design
              var latestDesign = findDesignInUser($scope.searchResult);
              if (User.isLoggedIn() && latestDesign) {
                User.getCurEditWheelchairDesign()._rev = latestDesign._rev; // attach the latest revision number
              }

              // Navigate to the tinker page
              $location.path('/tinker');
            });
        }
      };

      // The results container must always be same width of search container.
      // This is a more 'responsive' solution than setting a static size
      $scope.getWidth = function () {
        return document.getElementById('searchContainer').clientWidth;
      };

      // This is to update the width of the result containers...comment out the $scope.$digest() to see what I mean
      $scope.$on('$viewContentLoaded', function () {
        // $scope.$digest();
      });

    }]);
