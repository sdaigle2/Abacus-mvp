'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:MyDesignsCtrl
 * @description
 * # MyDesignsCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('MyDesignsCtrl', ['$scope', '$location', 'User', '_', 'ComparedDesigns', 'MAX_COMPARISON_CHAIRS', 'WHEELCHAIR_CANVAS_WIDTH', 'FrameData', '$q', 'Design',
  	function ($scope, $location, User, _, ComparedDesigns, MAX_COMPARISON_CHAIRS, WHEELCHAIR_CANVAS_WIDTH, FrameData, $q, Design) {
  		$scope.MAX_COMPARISON_CHAIRS = MAX_COMPARISON_CHAIRS;
  		$scope.WHEELCHAIR_CANVAS_WIDTH = WHEELCHAIR_CANVAS_WIDTH;

  		function isAComparedDesign(design) {
  			return ComparedDesigns.myDesigns.contains(design);
  		}

      // Given a design ID, gives a promise for the actual design object
      // If the designID is actually object, it is assumed to be the Design object and a
      // promise is returned with that object as its resolved value
      function getDesignById(designID) {
        if (designID instanceof Design) {
          var deferred = $q.defer();
          deferred.resolve(designID);
          return deferred.promise;
        } else if (_.isObject(designID)) {
          var deferred = $q.defer();
          deferred.resolve(new Design(designID));
          return deferred.promise;
        } else if (_.isString(designID)) {
          return User.fetchDesign(designID);
        }
      }

      $scope.wheelchairUIOpts = [];

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
        })
        .catch(function (err) {
          console.log(err);
        });
  		}

  		init();

  		$scope.deleteWheelchair = function (wheelchairIndex) {
  			var designToRemove = $scope.wheelchairUIOpts[wheelchairIndex].design;
  			$scope.wheelchairUIOpts.splice(wheelchairIndex, 1);

  			if (isAComparedDesign(designToRemove)) {
  				ComparedDesigns.myDesigns.removeDesign(designToRemove);
  			}
  		}

		//Sends the user back to abacus with the selected wheelchair
		$scope.editWheelchair = function (index) {
			alert('TODO: editWheelchair');
			// User.setEditWheelchair(index, $scope.wOrderIndex[index]);
			// $location.path('/tinker');
		};

  		$scope.addToCart = function (chairIdx) {
  			var design = $scope.wheelchairUIOpts[chairIdx].design;
  			User.getCart().addWheelchair(design);

  		};

  		$scope.dowloadDesignPDF = function (chairIdx) {
  			var design = $scope.wheelchairUIOpts[chairIdx].design;
  			alert('TODO: dowloadDesignPDF');
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
  	}]);
