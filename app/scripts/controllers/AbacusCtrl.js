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

    /***********Variables**************/
    $scope.frameData = dummyFrameData; //DATA PULLED FROM DATABASE
    var pages = dummyPages; //Array representing customization pages

    $scope.pageType = {
        CUSTOMIZE: 0,
        MEASURE: 1
    };

    //The current part customization page
    var curPage = {
        page: [pages.customizePages[0], pages.measurePages[0]], //has a current page for each page type
        type: $scope.pageType.CUSTOMIZE //keeps track of which page type we are currently looking at
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
    };

    /****************Weight and Price******************/
    //Calculated Total Weight and Price
    $scope.getTotalWeight = function () {
        var totalWeight = $scope.frameData.baseWeight;
        for (var i = 0; i < $scope.curWheelchair.parts.length; i++) {
            var curPart = $scope.curWheelchair.parts[i];
            totalWeight = totalWeight + getOptionData(curPart.optionID).weight;
        }
        return totalWeight;
    };
    $scope.getTotalPrice = function () {
        var totalPrice = $scope.frameData.basePrice;
        for (var i = 0; i < $scope.curWheelchair.parts.length; i++) {
            var curPart = $scope.curWheelchair.parts[i];
            totalPrice += getOptionData(curPart.optionID).price;
        }
        return totalPrice;
    };

    /****************Page Functions******************/
    $scope.getCurPages = function () {
        if (curPage.type === $scope.pageType.CUSTOMIZE)
            return pages.customizePages;
        return pages.measurePages;
    };
    $scope.getCustomizePages = function () { return pages.customizePages; };
    $scope.getMeasurePages = function () { return pages.measurePages; };

    $scope.getCurPage = function () { return curPage.page[curPage.type]; };
    $scope.getCurCustomizePage = function () { return curPage.page[$scope.pageType.CUSTOMIZE]; };
    $scope.getCurMeasurePage = function () { return curPage.page[$scope.pageType.MEASURE]; };

    $scope.getCurPageType = function () { return curPage.type; };

    //Returns the current part from FrameData based on curPage.page[CUSTOMIZE].ID
    $scope.getCurPartData = function () { return getPartData($scope.getCurCustomizePage().partID); };

    //Returns the current part from curWheelchair based on curPage.page[CUSTOMIZE].ID
    $scope.getCurWheelchairPart = function () { return getWheelchairPart($scope.getCurCustomizePage().partID); };

    //Returns the current measure from FrameData based on curPage.page[MEASURE].ID
    $scope.getCurMeasureData = function () { return getMeasureData($scope.getCurMeasurePage().measureID); };

    //Returns the current measure from curWheelchair based on curPage.page[MEASURE].ID
    $scope.getCurWheelchairMeasure = function () { return getWheelchairMeasure($scope.getCurMeasurePage().measureID); };

    $scope.setCurPageType = function (newType) { curPage.type = newType; };

    $scope.setCurPage = function (newIndex) { curPage.page[curPage.type] = $scope.getCurPages()[newIndex]; };
    $scope.setCurCustomizePage = function (newIndex) { curPage.page[$scope.pageType.CUSTOMIZE] = pages.customizePages[newIndex]; };
    $scope.setCurMeasurePage = function (newIndex) { curPage.page[$scope.pageType.MEASURE] = pages.measurePages[newIndex]; };


    function getPartData(id) {
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

    function getOptionData(id) {
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

    function getMeasureData(id) {
        for (var i = 0; i < $scope.frameData.measures.length; i++) {
            var curMeas = $scope.frameData.measures[i];
            if (curMeas.measureID === id)
                return curMeas;
        }
        return null;
    };

    function getWheelchairMeasure(id) {
        for (var i = 0; i < $scope.curWheelchair.measures.length; i++) {
            var curMeas = $scope.curWheelchair.measures[i];
            if (curMeas.measureID === id)
                return curMeas;
        }
        return null;
    };

    /****************ProgressBar******************/
    //Called by SideBarHeader left arrow OnClick (works similar to secSwitchClick)
    $scope.secSwitchLeft = function (){
      $scope.getCurPage().visitstatus = visitstatus.VISITED;
      $scope.setCurPage($scope.getCurPage().index - 1);
      $scope.getCurPage().visitstatus = visitstatus.CURRENT;
      $scope.closeAllPanels();
    };

    //Called by SideBarHeader right arrow OnClick (works similar to secSwitchClick)
    $scope.secSwitchRight = function (){
      $scope.getCurPage().visitstatus = visitstatus.VISITED;
      $scope.setCurPage($scope.getCurPage().index + 1);
      $scope.getCurPage().visitstatus = visitstatus.CURRENT;
      $scope.closeAllPanels();
    };

    //Called by progressbar section OnClick
    $scope.secSwitchClick = function(page){
      $scope.getCurPage().visitstatus = visitstatus.VISITED; //set current page to visit status: visited
      $scope.setCurPage(page.index); //set new current page
      $scope.getCurPage().visitstatus = visitstatus.CURRENT; //set new current page to visit status : current
      $scope.closeAllPanels(); //close any panels we may have opened
    };

    //Returns the proper image for the progress bar segment based on visit status
    $scope.getProgBarImage = function (page) {
        if (page.index === 0) {
            if (page.visitstatus === visitstatus.UNVISITED)
                return ('images/progress_bar/progress_bar_front_link.png');
            if (page.visitstatus === visitstatus.VISITED)
                return ('images/progress_bar/progress_bar_front_visited.png');
            if (page.visitstatus === visitstatus.CURRENT)
                return ('images/progress_bar/progress_bar_front_clicked.png');
        }
        else {
            if (page.visitstatus === visitstatus.UNVISITED)
                return ('images/progress_bar/progress_bar_link.png');
            if (page.visitstatus === visitstatus.VISITED)
                return ('images/progress_bar/progress_bar_visited.png');
            if (page.visitstatus === visitstatus.CURRENT)
                return ('images/progress_bar/progress_bar_clicked.png');
        }
    };

    /*****************Panels*********************/

    //Enumerated type for which panel to show for a given panelID
    $scope.panelTypes = {
      COLOR: 'color',
      DETAIL: 'detail'
    };

    //Indicates the current panel
    //ID = -1 indicates no panel open
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

/*********************Unscoped Variables Constants and Enums*******************************/

//The visitation status for pages/parts
var visitstatus = {
  VISITED: 'visited',
  UNVISITED: 'unvisited',
  CURRENT: 'current'
};

//The following data is DUMMY DATA used to test our progressbar data structure
//This data should be created on pageLoad based on FrameData
var dummyPages = {
    customizePages: [
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
    ],
    measurePages: [
        { index: 0, measureID: 1, visitstatus: visitstatus.CURRENT },
        { index: 1, measureID: 5, visitstatus: visitstatus.UNVISITED },
        { index: 2, measureID: 2, visitstatus: visitstatus.UNVISITED },
        { index: 3, measureID: 3, visitstatus: visitstatus.UNVISITED },
        { index: 4, measureID: 4, visitstatus: visitstatus.UNVISITED },
        { index: 5, measureID: 6, visitstatus: visitstatus.UNVISITED }
    ]
};

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
    ],
    measures: [
        {
            measureID: 1,
            name: "Rear Seat Height",
            desc: "Distance from ground to back corner of seat",
            measureOptions: ["12", "13", "14", "15", "16"],
            tip: "Important fators to think about when measuring rear seat height are <strong>body stability</strong>> and <b>shoulder strain</b>",
            videoURL: "https://www.youtube.com/embed/Leekuekq0hs",
            summary: "This is a container for the script of the video. This is a container for the script of the video.This is a container for the script of the video.This is a container for the script of the video. This is a container for the script of the video.This is a container for the script of the video.This is a container for the script of the video.This is a container for the script of the video.This is a container for the script of the video.This is a container for the script of the video.This is a container for the script of the video.This is a container for the script of the video.",
            imageURLs: ["", ""],
            chartURL: ""
        },
        {
            measureID: 5,
            name: "Wheel Radius",
            desc: "The <b>radius<\b> of the <b>wheel<\b>",
            measureOptions: ["100", "200", "500", "1000", "1E8"],
            tip: "Don't set this to 0 or you'll just get a regular chair",
            videoURL: "",
            summary: "This is a container for the script of the video. This is a container for the script of the video.This is a container for the script of the video.This is a container for the script of the video. This is a container for the script of the video.This is a container for the script of the video.This is a container for the script of the video.This is a container for the script of the video.This is a container for the script of the video.This is a container for the script of the video.This is a container for the script of the video.This is a container for the script of the video.",
            imageURLs: ["", ""],
            chartURL: ""
        }
    ]
};
