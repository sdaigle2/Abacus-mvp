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

    //The current part customization page
    $scope.curPage = $scope.pages[0];

    //Calculated Total Weight and Price
    $scope.getTotalWeight = function () {
        var totalWeight = $scope.frameData.baseWeight;
        for (var i = 0; i < $scope.curWheelchair.parts.length; i++) {
            var curPart = $scope.curWheelchair.parts[i];
            totalWeight = totalWeight + getOption(curPart.optionID).weight;
        }
        return totalWeight;
    };
    $scope.getTotalPrice = function () {
        var totalPrice = $scope.frameData.basePrice;
        for (var i = 0; i < $scope.curWheelchair.parts.length; i++) {
            var curPart = $scope.curWheelchair.parts[i];
            totalPrice += getOption(curPart.optionID).price;
        }
        return totalPrice;
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
            },
            {
                partID: 3,
                optionID: 2,
                colorName: 'Red'
            },
            {
                partID: 2,
                optionID: 6,
                colorName: 'Red'
            }
        ]
    };

    //The data used in the customization
    $scope.frameData = dummyFrameData;


    //Returns the current part based on curPartID
    $scope.getCurPart = function () {
        return getPart($scope.curPage.partID);
    };

    //Returns the current part in curWheelchair based on curPartID
    $scope.getCurWheelchairPart = function () {
        return getWheelchairPart($scope.curPage.partID);
    };

    function getPart(id) {
        for (var i = 0; i < $scope.frameData.parts.length; i++) {
            var curPart = $scope.frameData.parts[i];
            if (curPart.partID === id)
                return curPart;
        }
        return null;
    };

    function getWheelchairPart(id) {
        for (var i = 0; i < $scope.curWheelchair.parts.length; i++) {
            var curPart = $scope.curWheelchair.parts[i];
            if (curPart.partID === id)
                return curPart;
        }
        return null;
    };

    function getOption(id) {
        for (var i = 0; i < $scope.frameData.parts.length; i++) {
            var curPart = $scope.frameData.parts[i];
            for (var j = 0; j < curPart.options.length; j++) {
                var curOption = curPart.options[j];
                if (curOption.optionID === id)
                    return curOption;
            }
        }
        return null;
    }

    //Called by SideBarHeader left arrow OnClick
    $scope.secSwitchLeft = function (){
      $scope.curPage.visitstatus = visitstatus.VISITED;
      $scope.curPage = $scope.pages[($scope.curPage.index)-1];
      $scope.curPage.visitstatus = visitstatus.CURRENT;
      $scope.closeAllPanels();
    };

    //Called by SideBarHeader right arrow OnClick
    $scope.secSwitchRight = function (){
      $scope.curPage.visitstatus = visitstatus.VISITED;
      $scope.curPage = $scope.pages[($scope.curPage.index)+1];
      $scope.curPage.visitstatus = visitstatus.CURRENT;
      $scope.closeAllPanels();
    };

    //Called by progressbar section OnClick
    $scope.secSwitchClick = function(item){
      $scope.curPage.visitstatus = visitstatus.VISITED;
      $scope.curPage = item;
      $scope.curPage.visitstatus = visitstatus.CURRENT;
      $scope.closeAllPanels();
    };


    /*Panel functions */
    $scope.panelTypes = {
      COLOR: 'color',
      DETAIL: 'detail'
    };

    //Indicates the current panel
    //ID = -1 indeicates no panel open
    $scope.curPanel = {
        panelID: -1,
        panelType: $scope.panelTypes.COLOR
    };

    //Sets curPanel to the chosen panel
    //Closes the panel if id and type match curPanel
    $scope.setPanel = function (id, type) {
        if ($scope.isPanelSelected(id, type))
            $scope.curPanel.panelID = -1;
        else
            $scope.curPanel.panelID = id;
        $scope.curPanel.panelType = type;
    };

    //Closes any open panel
    $scope.closeAllPanels = function () {
        $scope.setPanel(-1, $scope.panelTypes.COLOR);
    };

    //Check if the panel with the given id and type is selected
    $scope.isPanelSelected = function (id, type) {
        return ($scope.curPanel.panelID === id && $scope.curPanel.panelType === type);
    };

    //Checks if a panel with the given ID is selected
    $scope.isPanelIDSelected = function (id) {
        return $scope.curPanel.panelID === id;
    };

  });

//The visitation status for pages/parts
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
                    name: "Super Ultra Spinning Wheels of Awesomeness Deluxe Alpha 3D",
                    price: 200,
                    weight: 6,
                    desc: "A description",
                    image: "images/d_panel_1.png",
                    colors: [
                        {
                            name: "Red",
                            hex: "#FF0000"
                        },
                        {
                            name: "Green",
                            hex: "#00FF00"
                        },
                        {
                            name: "Blue",
                            hex: "#0000FF"
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
                    optionID: 6,
                    name: "lala bom lala bom ",
                    price: 200,
                    weight: 6,
                    desc: "A description",
                    image: "images/d_panel_1.png",
                    colors: [
                        {
                            name: "Red",
                            hex: "#FF0000"
                        },
                        {
                            name: "Green",
                            hex: "#00FF00"
                        },
                        {
                            name: "Blue",
                            hex: "#0000FF"
                        }
                    ]
                },
                {
                    optionID: 5,
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
