/**
 * Created by Sourabh on 3/8/2016.
 */
'use strict';

angular.module('abacuApp')
  .controller('CompareCtrl',['$scope', 'Design', 'TEMP_CHAIR', '_', 'FrameData', 'User', 'MAX_COMPARISON_CHAIRS', 'ComparedDesigns',
  	function ($scope, Design, TEMP_CHAIR, _, FrameData, User, MAX_COMPARISON_CHAIRS, ComparedDesigns) {
    $scope.MAX_COMPARISON_CHAIRS = MAX_COMPARISON_CHAIRS;
  	
    $scope.addWheelchair = function () {
      // TODO: Find out what to do when add wheelchair is clicked
      $scope.comparisons.push({
        design: new Design(TEMP_CHAIR),
        checked: true
      });
  	};

    $scope.comparisons = ComparedDesigns.getDesigns().map(function (design) {
      return {
        design: design,
        checked: true
      };
    });

  	// Helper method to get Frame for each wheelchair in the $scope.comparisons list
  	function getWheelchairFrames() {
  		var wheelchairs = _.map($scope.comparisons, 'design.wheelchair');
  		var frames = wheelchairs.map(function (chair) {
  			return FrameData.getFrame(chair.getFrameID());
  		});

  		return frames;
  	}

  	$scope.getPartNameByID = function (partID) {
  		var wheelchair = _.first($scope.comparisons).design.wheelchair;
  		return wheelchair.getPartDetails(partID, User.getUnitSys()).partName;
  	};

  	$scope.getPartIDs = function () {
  		var frames = getWheelchairFrames();

  		var partIDsTotal = frames.reduce(function (partIDs, frame) {
  			var framePartIDs = _.map(frame.getParts(), 'partID');
  			return partIDs.concat(framePartIDs);
  		},[]);

  		return _.uniq(partIDsTotal);
  	};

    $scope.getChairPartOption = function (chair, partID) {
      return chair.getPartDetails(partID, User.getUnitSys()).optionName;
    };

    $scope.$watchCollection('comparisons', function (comparisons) {
      ComparedDesigns.setDesigns(_.map(comparisons, 'design'));
    });

  }])
  .value('TEMP_CHAIR', {
  "_id": "E19naMu3g",
  "_rev": "1-ea5f7a570f395b605107f4103f23b2cf",
  "creator": "sourabhdesai@gmail.com",
  "createdAt": "2016-03-08T19:57:13.325Z",
  "updatedAt": "2016-03-08T19:57:13.325Z",
  "wheelchair": {
    "frameID": 3,
    "title": "My Custom Wheelchair",
    "parts": [
      {
        "partID": 1000,
        "optionID": 1100,
        "colorID": 1101,
        "sizeIndex": -1
      },
      {
        "partID": 2000,
        "optionID": 2100,
        "colorID": 1101,
        "sizeIndex": -1
      },
      {
        "partID": 3000,
        "optionID": 3100,
        "colorID": 0,
        "sizeIndex": -1
      },
      {
        "partID": 4000,
        "optionID": 4100,
        "colorID": 4101,
        "sizeIndex": -1
      },
      {
        "partID": 11000,
        "optionID": 11100,
        "colorID": 0,
        "sizeIndex": -1
      },
      {
        "partID": 5000,
        "optionID": 5100,
        "colorID": 0,
        "sizeIndex": -1
      },
      {
        "partID": 6000,
        "optionID": 6200,
        "colorID": 0,
        "sizeIndex": 0
      },
      {
        "partID": 7000,
        "optionID": 7100,
        "colorID": 0,
        "sizeIndex": -1
      },
      {
        "partID": 8000,
        "optionID": 8100,
        "colorID": 0,
        "sizeIndex": -1
      },
      {
        "partID": 9000,
        "optionID": 9100,
        "colorID": 0,
        "sizeIndex": -1
      },
      {
        "partID": 10000,
        "optionID": 10100,
        "colorID": 0
      }
    ],
    "measures": [
      {
        "measureID": 15001,
        "measureOptionIndex": -1
      },
      {
        "measureID": 15002,
        "measureOptionIndex": -1
      },
      {
        "measureID": 15003,
        "measureOptionIndex": -1
      },
      {
        "measureID": 15004,
        "measureOptionIndex": -1
      },
      {
        "measureID": 15005,
        "measureOptionIndex": -1
      },
      {
        "measureID": 15006,
        "measureOptionIndex": -1
      },
      {
        "measureID": 15006,
        "measureOptionIndex": -1
      },
      {
        "measureID": 15007,
        "measureOptionIndex": -1
      },
      {
        "measureID": 15008,
        "measureOptionIndex": -1
      },
      {
        "measureID": 15009,
        "measureOptionIndex": -1
      },
      {
        "measureID": 15010,
        "measureOptionIndex": -1
      },
      {
        "measureID": 15011,
        "measureOptionIndex": -1
      },
      {
        "measureID": 15012,
        "measureOptionIndex": -1
      },
      {
        "measureID": 15013,
        "measureOptionIndex": -1
      },
      {
        "measureID": 15014,
        "measureOptionIndex": -1
      }
    ],
    "inCurOrder": false
  }
});