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

    //Array representing progressbar
    $scope.progs = progSec;

    $scope.curPart = $scope.progs[0];


    //Calculated Total Weight and Price
    $scope.getTotalWeight = function () {
        return 150;
    };
    $scope.getTotalPrice = function () {
        return 250.75;
    };

    $scope.getCurStatus1 = function(item){
      if(item.partID ===0) {
        if (item.progstatus === 'unvisited')
          return ('images/progress_bar/progress_bar_front_link.png');
        if (item.progstatus === 'visited')
          return ('images/progress_bar/progress_bar_front_visited.png');
        if (item.progstatus === 'current')
          return ('images/progress_bar/progress_bar_front_clicked.png');
      }
      else {
        if (item.progstatus === 'unvisited')
          return ('images/progress_bar/progress_bar_link.png');
        if (item.progstatus === 'visited')
          return ('images/progress_bar/progress_bar_visited.png');
        if (item.progstatus === 'current')
          return ('images/progress_bar/progress_bar_clicked.png');
      }


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
    $scope.curPartID = function (currentSec){
      return currentSec.partID;
    };

    //The data used in the customization
    $scope.frameData = frameData;

    //Returns the current part based on curPartID
    $scope.getCurPart = function () {
        for (var i = 0; i < $scope.frameData.parts.length; i++) {
            var curPart = $scope.frameData.parts[i];
            if (curPart.partID === $scope.curPartID($scope.curPart))
                return curPart;
        }
        return null;
    };

    $scope.secSwitchLeft = function (){
      $scope.curPart.progstatus = 'visited';
      $scope.curPart = $scope.progs[($scope.curPart.partID)-1];
      $scope.curPart.progstatus = 'current';


    };

    $scope.secSwitchRight = function (){
      $scope.curPart.progstatus = 'visited';
      $scope.curPart = $scope.progs[($scope.curPart.partID)+1];
      $scope.curPart.progstatus = 'current';
    };

    $scope.secSwitchClick = function(item){
      $scope.curPart.progstatus = 'visited';
      $scope.curPart = item;
      $scope.curPart.progstatus = 'current';
    }



    $scope.closeAllColorPanels = function () {
      $(".colorPanel").each(function () {
        $(this).removeClass("colorPanelIn").addClass("colorPanelOut");
      });
      $(".colorPanelArrow").each(function () {
        $(this).removeClass("colorPanelArrowIn").addClass("colorPanelArrowOut");
      });
    }

  });
var progstatus = {
  VISITED: 'visited',
  UNVISITED: 'unvisited',
  CURRENT: 'current'
}



var progSec=[
  {partID:0,progstatus:progstatus.CURRENT},
  {partID:1,progstatus:progstatus.UNVISITED},
  {partID:2,progstatus:progstatus.UNVISITED},
  {partID:3,progstatus:progstatus.UNVISITED},
  {partID:4,progstatus:progstatus.UNVISITED},
  {partID:5,progstatus:progstatus.UNVISITED},
  {partID:6,progstatus:progstatus.UNVISITED},
  {partID:7,progstatus:progstatus.UNVISITED},
  {partID:8,progstatus:progstatus.UNVISITED},
  {partID:9,progstatus:progstatus.UNVISITED},
  {partID:10,progstatus:progstatus.UNVISITED},
  {partID:11,progstatus:progstatus.UNVISITED}

];

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
        },


        {
            partID: 1,
            name: "Wheels",
            options: [
                {
                    optionID: 0,
                    name: "Spinagy fdsajklciow fiowe ccwjio",
                    price: 200,
                    weight: 6,
                    desc: "A description",
                    image: "images/d_panel_1.png",
                    colors: [
                        {
                            name: "Red",
                            hex: 0xFF0000
                        },
                        {
                            name: "Green",
                            hex: 0x00FF00
                        },
                        {
                            name: "Blue",
                            hex: 0x0000FF
                        }
                    ]
                },
                {
                    optionID: 1,
                    name: "sWheel",
                    price: 2000,
                    weight: 4,
                    desc: "An ultra-extreme light wheel",
                    image: "images/d_panel_2.png",
                    colors: []
                }
            ]
        },

      {
            partID: 2,
            name: "la la la",
            options: [
                {
                    optionID: 0,
                    name: "lala bom lala bom ",
                    price: 200,
                    weight: 6,
                    desc: "A description",
                    image: "images/d_panel_1.png",
                    colors: [
                        {
                            name: "Red",
                            hex: 0xFF0000
                        },
                        {
                            name: "Green",
                            hex: 0x00FF00
                        },
                        {
                            name: "Blue",
                            hex: 0x0000FF
                        }
                    ]
                },
                {
                    optionID: 1,
                    name: "sWheel",
                    price: 2000,
                    weight: 4,
                    desc: "An ultra-extreme light wheel",
                    image: "images/d_panel_2.png",
                    colors: []
                }
            ]
        }
    ]
};
