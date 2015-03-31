'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:CartCtrl
 * @description
 * # CartCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('CartCtrl', function ($scope) {

    var SHIP_FEE_PER_WHEELCHAIR = 15;
    var TAX_RATE = 0.20;

    $scope.wheelchairs = dummyCreatedWheelchairs;

    /********************CART ITEM BUTTONS******************************/

    $scope.seeWheelchairDetails = function (index) {
      alert("seeWheelchairDetails("+index+")");
    };

    $scope.editWheelchair = function (index) {
      alert("editWheelchair(" + index + ")");
    };

    $scope.removeWheelchair = function (index) {
      //TODO: Something more database-y
      $scope.wheelchairs.splice(index, 1);
    };

    /********************SIDEBAR CALCULATIONS************************/
    $scope.calculateSubtotal = function () {
      var total = 0;
      for (var i = 0; i < $scope.wheelchairs.length; i++)
        total += $scope.wheelchairs[i].calcPrice;
      return total;
    };

    $scope.calculateShippingFee = function () {
      return SHIP_FEE_PER_WHEELCHAIR * $scope.wheelchairs.length;
    };

    $scope.calculateTax = function () {
      return TAX_RATE * $scope.calculateSubtotal();
    };

    $scope.calculateTotalPrice = function () {
      return $scope.calculateSubtotal() + $scope.calculateShippingFee() + $scope.calculateTax();
    };

  });


//Dummy Data for created wheelchairs
//Each object is a curWheelchair
//Has some extra fields - such as calcPrice, calcWeight, and Title
var dummyCreatedWheelchairs = [
  {
    title: "Drew's wheelchair 7000",
    calcPrice: 5753.33,
    calcWeight: 45.2,
    imgURL: "images/d_panel_1.png", //Note: replace this with generated images
    frameID: 0,
    parts: [
      {
        partID: 0,
        optionID: 0,
        colorID: 0
      },
      {
        partID: 3,
        optionID: 2,
        colorID: 0
      }
    ],
    measures: [
      {
        measureID: 5,
        measureOption: null
      },
      {
        measureID: 1,
        measureOption: null
      }
    ]
  },
  {
    title: "Drew's wheelchair 8000",
    calcPrice: 5753.33,
    calcWeight: 45.2,
    imgURL: "images/d_panel_2.png", //Note: replace this with generated images
    frameID: 0,
    parts: [
      {
        partID: 0,
        optionID: 0,
        colorID: 0
      },
      {
        partID: 3,
        optionID: 2,
        colorID: 0
      }
    ],
    measures: [
      {
        measureID: 5,
        measureOption: null
      },
      {
        measureID: 1,
        measureOption: null
      }
    ]
  },
  {
    title: "Drew's wheelchair 9000",
    calcPrice: 5753.33,
    calcWeight: 45.2,
    imgURL: "images/d_panel_3.png", //Note: replace this with generated images
    frameID: 0,
    parts: [
      {
        partID: 0,
        optionID: 0,
        colorID: 0
      },
      {
        partID: 3,
        optionID: 2,
        colorID: 0
      }
    ],
    measures: [
      {
        measureID: 5,
        measureOption: null
      },
      {
        measureID: 1,
        measureOption: null
      }
    ]
  },
  {
    title: "Drew's wheelchair 4007",
    calcPrice: 5753.33,
    calcWeight: 45.2,
    imgURL: "images/d_panel_4.png", //Note: replace this with generated images
    frameID: 0,
    parts: [
      {
        partID: 0,
        optionID: 0,
        colorID: 0
      },
      {
        partID: 3,
        optionID: 2,
        colorID: 0
      }
    ],
    measures: [
      {
        measureID: 5,
        measureOption: null
      },
      {
        measureID: 1,
        measureOption: null
      }
    ]
  },
  {
    title: "Drew's wheelchair 7000",
    calcPrice: 5753.33,
    calcWeight: 45.2,
    imgURL: "images/d_panel_1.png", //Note: replace this with generated images
    frameID: 0,
    parts: [
      {
        partID: 0,
        optionID: 0,
        colorID: 0
      },
      {
        partID: 3,
        optionID: 2,
        colorID: 0
      }
    ],
    measures: [
      {
        measureID: 5,
        measureOption: null
      },
      {
        measureID: 1,
        measureOption: null
      }
    ]
  }
];