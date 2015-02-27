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

    //Array representing customization pages
    $scope.pages = dummyPages;

    $scope.curPage = $scope.pages[0];

    //Calculated Total Weight and Price
    $scope.getTotalWeight = function () {
        return 150;
    };
    $scope.getTotalPrice = function () {
        return 250.75;
    };

    //Returns the proper image for the progress bar segment based on visit status
    $scope.getProgBarImage = function(item){
      if(item.index ===0) {
        if (item.visitstatus === visitstatus.UNVISITED)
          return ('images/progress_bar/progress_bar_front_link.png');
        if (item.visitstatus === visitstatus.VISITED)
          return ('images/progress_bar/progress_bar_front_visited.png');
        if (item.visitstatus === visitstatus.CURRENT)
          return ('images/progress_bar/progress_bar_front_clicked.png');
      }
      else {
        if (item.visitstatus === visitstatus.UNVISITED)
          return ('images/progress_bar/progress_bar_link.png');
        if (item.visitstatus === visitstatus.VISITED)
          return ('images/progress_bar/progress_bar_visited.png');
        if (item.visitstatus === visitstatus.CURRENT)
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
                colorName: 'Red'
            }
        ]
    };

    //The data used in the customization
    $scope.frameData = dummyFrameData;

    //Returns the current part based on curPartID
    $scope.getCurPart = function () {
        for (var i = 0; i < $scope.frameData.parts.length; i++) {
            var curPart = $scope.frameData.parts[i];
            if (curPart.partID === $scope.curPage.partID)
                return curPart;
        }
        return null;
    };

    //Called by SideBarHeader left arrow OnClick
    $scope.secSwitchLeft = function (){
      $scope.curPage.visitstatus = visitstatus.VISITED;
      $scope.curPage = $scope.pages[($scope.curPage.index)-1];
      $scope.curPage.visitstatus = visitstatus.CURRENT;
    };

    //Called by SideBarHeader right arrow OnClick
    $scope.secSwitchRight = function (){
      $scope.curPage.visitstatus = visitstatus.VISITED;
      $scope.curPage = $scope.pages[($scope.curPage.index)+1];
      $scope.curPage.visitstatus = visitstatus.CURRENT;
    };

    //Called by progressbar section OnClick
    $scope.secSwitchClick = function(item){
      $scope.curPage.visitstatus = visitstatus.VISITED;
      $scope.curPage = item;
      $scope.curPage.visitstatus = visitstatus.CURRENT;
    };


    //handle closing all color panels using jQuery (replace this with an angular way)
    $scope.closeAllColorPanels = function () {
      $(".colorPanel").each(function () {
        $(this).removeClass("colorPanelIn").addClass("colorPanelOut");
      });
      $(".colorPanelArrow").each(function () {
        $(this).removeClass("colorPanelArrowIn").addClass("colorPanelArrowOut");
      });
    }
  });

var visitstatus = {
  VISITED: 'visited',
  UNVISITED: 'unvisited',
  CURRENT: 'current'
};


var dummyPages=[
  { index: 0, partID: 0, visitstatus: visitstatus.CURRENT },
  { index: 1, partID: 3, visitstatus: visitstatus.UNVISITED },
  { index: 2, partID: 2, visitstatus: visitstatus.UNVISITED },
  { index: 3, partID: 1, visitstatus: visitstatus.UNVISITED },
  { index: 4, partID: 4, visitstatus: visitstatus.UNVISITED },
  { index: 5, partID: 5, visitstatus: visitstatus.UNVISITED },
  { index: 6, partID: 6, visitstatus: visitstatus.UNVISITED },
  { index: 7, partID: 7, visitstatus: visitstatus.UNVISITED },
  { index: 8, partID: 8, visitstatus: visitstatus.UNVISITED },
  { index: 9, partID: 9, visitstatus: visitstatus.UNVISITED },
  { index: 10, partID: 10, visitstatus: visitstatus.UNVISITED },
  { index: 11, partID: 11, visitstatus: visitstatus.UNVISITED }
];

//The following is all dummy data for the sidebar used to test our data structure
//This data should be replaced by database data for the final release
var dummyFrameData = {
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
                        },
                        {
                            name: "Magenta",
                            hex: "#FF00FF"
                        },
                        {
                            name: "Yellow",
                            hex: "#FFFF00"
                        },
                        {
                            name: "Cyan",
                            hex: "#00FFFF"
                        },
                        {
                            name: "Black",
                            hex: "#000000"
                        }
                    ]
                },
                {
                    optionID: 1,
                    name: "Tilite Fork Ultra Extreme",
                    price: 200,
                    weight: 45,
                    desc: "An ultra-extreme description.  This description is so long and awesome that no one who has read it has lived to tell the tale.  Something something Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam metus nisi, consectetur ac orci vitae, finibus pretium sem. Quisque ultrices nulla metus, at condimentum risus volutpat eget. Ut in auctor.",
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
            partID: 3,
            name: "Wheels",
            options: [
                {
                    optionID: 2,
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
                    optionID: 4,
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
                    optionID: 5,
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
                    optionID: 6,
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
