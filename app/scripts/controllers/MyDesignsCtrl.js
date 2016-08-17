'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:MyDesignsCtrl
 * @description
 * # MyDesignsCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('MyDesignsCtrl', ['$scope', '$location', 'User', '_', 'ComparedDesigns', 'MAX_COMPARISON_CHAIRS',
   'WHEELCHAIR_CANVAS_WIDTH', 'FrameData', '$q', 'Design', 'PromiseUtils', 'DownloadPDF', 'ngDialog',
  	function ($scope, $location, User, _, ComparedDesigns, MAX_COMPARISON_CHAIRS, WHEELCHAIR_CANVAS_WIDTH, 
      ameData, $q, Design, PromiseUtils, DownloadPDF, ngDialog) {
  		$scope.MAX_COMPARISON_CHAIRS = MAX_COMPARISON_CHAIRS;
  		$scope.WHEELCHAIR_CANVAS_WIDTH = WHEELCHAIR_CANVAS_WIDTH;

      $scope.guideSection = false;

  		function isAComparedDesign(design) {
  			return ComparedDesigns.myDesigns.contains(design);
  		}

      // Given a design ID, gives a promise for the actual design object
      // If the designID is actually object, it is assumed to be the Design object and a
      // promise is returned with that object as its resolved value
      function getDesignById(designID) {
        if (designID instanceof Design) {
          return PromiseUtils.resolved(designID);
        } else if (_.isObject(designID)) {
          return PromiseUtils.resolved(new Design(designID));
        } else if (_.isString(designID)) {
          return User.fetchDesign(designID);
        } else {
          return PromiseUtils.rejected(new Error('Bad Argument to getDesignById: ' + JSON.stringify(designID) ));
        }
      }

      function getItemIndex(id) {
        return _.findIndex($scope.wheelchairUIOpts, function(o) {
          return o.design._id == id; 
        });
      }

      function getPagination() {
        var begin = ($scope.currentPage - 1) * $scope.numPerPage
        return {
          'begin': begin,
          'end': begin + $scope.numPerPage
        }
      }

      $scope.wheelchairUIOpts = [];

      $scope.currentPage = 1;
      $scope.numPerPage = 10;
      $scope.maxSize = 5;
      $scope.$watch('currentPage + numPerPage', function() {
        $scope.filteredWheelchairUIOpts = _.cloneDeep($scope.wheelchairUIOpts);
        _.reverse($scope.filteredWheelchairUIOpts);
        $scope.filteredWheelchairUIOpts = $scope.filteredWheelchairUIOpts.slice(getPagination().begin, getPagination().end);
      });

  		function init() {
        // Load all the designs asynchronously and then set wheelchairUIOpts once they're loaded
        var wheelchairUIOptsUserPromises = User.getSavedDesigns()
          .map(getDesignById)
          .map(function (designPromise) {
            return designPromise.then(function (design) {
              return {
                design: design,
                checked: isAComparedDesign(design),
                showInfo: false
              };
            });
          });

        $q.all(wheelchairUIOptsUserPromises)
        .then(function (wheelchairUIOpts) {
          $scope.wheelchairUIOpts = wheelchairUIOpts;
          $scope.filteredWheelchairUIOpts = _.cloneDeep($scope.wheelchairUIOpts);
          _.reverse($scope.filteredWheelchairUIOpts);
          $scope.filteredWheelchairUIOpts = $scope.filteredWheelchairUIOpts.slice(getPagination().begin, getPagination().end);
        })
        .catch(function (err) {
          console.log(err);
        });
  		}

  		init();

  		$scope.deleteWheelchair = function (wheelchairId, addCart) {
        var itemIndex = typeof wheelchairId === 'number' ? wheelchairId : getItemIndex(wheelchairId);
        var designToRemove = $scope.wheelchairUIOpts[itemIndex].design;
        $scope.wheelchairUIOpts.splice(itemIndex, 1);

        $scope.filteredWheelchairUIOpts = _.cloneDeep($scope.wheelchairUIOpts);
        _.reverse($scope.filteredWheelchairUIOpts);
        $scope.filteredWheelchairUIOpts = $scope.filteredWheelchairUIOpts.slice(getPagination().begin, getPagination().end);

  			if (isAComparedDesign(designToRemove)) {
  				ComparedDesigns.myDesigns.removeDesign(designToRemove);
  			}
        return addCart ? User.removeDesignFromSavedDesigns(designToRemove, true) : User.removeDesignFromSavedDesigns(designToRemove);
  		};

      $scope.shareDesignId = function (id) {
        var index = getItemIndex(id);
        $scope.modalDesign = User.getOneSavedDesign(index);
        return ngDialog.open({
          'template': 'views/modals/designIDModal.html',
          'scope': $scope
        })
      };

  		//Sends the user back to abacus with the selected wheelchair
  		$scope.editWheelchair = function (id) {
        var itemIndex = getItemIndex(id);
        if ($scope.wheelchairUIOpts[itemIndex].checked) {
          // if it is a comared design, remove it from ComparedDesigns storage
          ComparedDesigns.myDesigns.removeDesign($scope.wheelchairUIOpts[itemIndex].design);
        }

  			User.setEditWheelchairFromMyDesign(itemIndex, $scope.wheelchairUIOpts[itemIndex].design)
          .then(function () {
            $location.search({}).path('/tinker');
          });
  		};

  		$scope.addToCart = function (id) {
        var itemIndex = getItemIndex(id);
  			var design = $scope.wheelchairUIOpts[itemIndex].design;
  			User.getCart().addWheelchair(design);
        return $scope.deleteWheelchair(itemIndex, true);
  		};

  		$scope.dowloadDesignPDF = function (id) {
        var itemIndex = getItemIndex(id);
  			var design = $scope.wheelchairUIOpts[itemIndex].design;
        DownloadPDF.forWheelchairs(design);
  		};

  		$scope.numChecked = function () {
  			return _.filter($scope.wheelchairUIOpts, 'checked').length;
  		};

		//Returns an object of display-friendly strings regarding the given part
		$scope.getPartDetails = function (wheelchair, part) {
			return wheelchair.getPartDetails(part.partID, User.getUnitSys());
		};

		$scope.getPartOption = function (wheelchair, part) {
			return $scope.getPartDetails(wheelchair, part).optionName;
		};

		// Get all the names for all the measured parts
		$scope.getWheelchairMeasures = function (wheelchair) {
			var frameID = wheelchair.getFrameID();
			var frame = FrameData.getFrame(frameID);
			var measures = frame.getMeasures();

			return measures;
		};

		//Returns an object of display-friendly strings regarding the given measure
		$scope.getMeasureDetails = function (wheelchair, measure) {
			return wheelchair.getMeasureDetails(measure.measureID, User.getUnitSys());
		};

  		$scope.goToCompare = function () {
  			$location.path('/compare').search({
  				'from': 'myDesigns'
  			});
  		};

  		$scope.$watch('wheelchairUIOpts', function (newUIOpts, oldUIOpts) {
        if (newUIOpts.length !== oldUIOpts.length) {
          // Can't check for check flips if the arrays are different lengths
          return;
        }
  			// Get all the wheelchairUIOpts items that have been changed from what they were before
  			var checkFlippedOpts = newUIOpts.filter(function (newOpt, index) {
  				var oldOpt = oldUIOpts[index];
  				return newOpt.checked !== oldOpt.checked;
  			});

  			// Split it into the ones that were checked and unchecked
  			var checkedOpts = _.filter(checkFlippedOpts, 'checked');
  			var uncheckedOpts = _.reject(checkFlippedOpts, 'checked');

  			// Add them to the compared designs service
  			checkedOpts.forEach(function (chairOpts) {
  				ComparedDesigns.myDesigns.addDesign(chairOpts.design);
  			});

  			// Remove them from the compared designs service
  			uncheckedOpts.forEach(function (chairOpts) {
				  ComparedDesigns.myDesigns.removeDesign(chairOpts.design);
  			});
  		}, true);

      $scope.jumpFrame = function(){
        $location.path('/frames');
      };

      //guide logic
      $scope.openGuide = function(){
        $scope.guideSection = true;
      };
      $scope.closeGuide = function(){
        $scope.guideSection = false;
      };
  	}]);
