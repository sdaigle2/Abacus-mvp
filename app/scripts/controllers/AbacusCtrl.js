'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:AbacusCtrl
 * @description
 * # AbacusCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('AbacusCtrl', function ($scope) {
    //Array representing progressbar
    $scope.progs = progesssec;

    //Method that toggles a provided boolean value
    $scope.toggleItem = function(item) {
      return !item;
    }

    //Calculated Total Weight and Price
    $scope.getTotalWeight = function () {
        return 150;
    };
    $scope.getTotalPrice = function () {
        return 250.75;
    };

    //The current wheelchair being customized by the user
    $scope.curWheelchair = {
        frameID: 0,
        parts: [
            {
                partID: 0,
                optionID: 0,
                colorName: "Red"
            }
        ]
    };

    //The current partID the user is customizing
    $scope.curPartID = 0;

    //The data used in the customization
    $scope.frameData = frameData;

    //Returns the current part based on curPartID
    $scope.getCurPart = function () {
        for (var i = 0; i < $scope.frameData.parts.length; i++) {
            var curPart = $scope.frameData.parts[i];
            if (curPart.partID === $scope.curPartID)
                return curPart;
        }
        return null;
    };

    $scope.closeAllColorPanels = function () {
      $(".colorPanel").each(function () {
        $(this).removeClass("colorPanelIn").addClass("colorPanelOut");
      });
      $(".colorPanelArrow").each(function () {
        $(this).removeClass("colorPanelArrowIn").addClass("colorPanelArrowOut");
      });
    }

  });

var progesssec={
  1:false,
  2:false,
  3:false,
  4:false,
  5:false,
  6:false,
  7:false,
  8:false,
  9:false,
  10:false,
  11:false,
  12:false
};

//The following is all dummy data for the sidebar used to test our data structure
//This data should be replaced by database data for the final release
var frameData = {
    frameID: 0,
    basePrice: 400,
    baseWeight: 50,
    name: "tiArrow Standard",
    desc: "The standard frame produced by tiArrow.",
    image: "",
    parts: [
        {
            partID: 0,
            name: "Caster-Fork",
            options: [
                {
                    optionID: 0,
                    name: "Tilite Slipstream Single-Sided Fork",
                    price: 20,
                    weight: 4,
                    desc: "A description",
                    image: "images/d_panel_1.png",
                    colors: [
                        {
                            name: "Red",
                            hex: "#E7331A"
                        },
                        {
                            name: "Green",
                            hex: "#2CA635"
                        },
                        {
                            name: "Blue",
                            hex: "#075EDA"
                        }
                    ]
                },
                {
                    optionID: 1,
                    name: "Tilite Fork Ultra Extreme",
                    price: 200,
                    weight: 45,
                    desc: "An ultra-extreme description",
                    image: "images/d_panel_2.png",
                  colors: [
                    {
                      name: "Red",
                      hex: "#E7331A"
                    },
                    {
                      name: "Green",
                      hex: "#2CA635"
                    }
                  ]
                }
            ]
        }
    ]
};

