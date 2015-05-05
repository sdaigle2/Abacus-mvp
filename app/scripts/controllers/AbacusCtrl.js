﻿// jshint unused:false
/* globals frameDataFromDB:true, cartDataFromDB:true, curWheelchair:true, $ */
'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:AbacusCtrl
 * @description
 * # AbacusCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('AbacusCtrl', ['$scope', '$location', 'sharedVars', 'FrameData', 'User', 'Wheelchair', 'Angles',
    function ($scope, $location, sharedVars, FrameData, User, Wheelchair, Angles) {

    /*********************Enums*******************************/

    //The visitation status for pages (parts/measures)
    var visitstatus = {
      VISITED: 'visited',
      UNVISITED: 'unvisited',
      CURRENT: 'current'
    };

    $scope.pageType = {
      CUSTOMIZE: 0,
      MEASURE: 1
    };

    $scope.panelTypes = {
      COLOR: 'color',
      DETAIL: 'detail'
    };

    $scope.unitSys = {
      METRIC: 0,
      IMPERIAL: 1
    };

    /**********************Main Variables****************************/

    //All the data about the current frame (loaded by init)
    $scope.frameData = null;

    //Arrays that store information about the pages
    var pages = {
      customizePages: [],
      measurePages: []
    };

    //The current part customization page
    var curPage = {
      page: [null, null], //has a current page for each page type
      type: $scope.pageType.CUSTOMIZE //keeps track of which page type we are currently looking at
    };

    //The images used to generate the full wheelchair image
    $scope.previewImgs = [];

    //The current angle the wheelchair is being viewed from
    var curAngle = Angles.FRONTRIGHT;

    //The current measurement system being used
    $scope.curUnitSys = $scope.unitSys.IMPERIAL;

    /***************************Initialization****************************/

    //Generates the page arrays inside of pages
    function generatePages (){

      //part customization pages generation
      for (var i = 0; i < $scope.frameData.parts.length; i++ ){
        var pPage = {index:i, partID: $scope.frameData.parts[i].partID, visitstatus:visitstatus.UNVISITED};
        pages.customizePages.push(pPage);
      }

      //measure pages generation
      for (var j = 0; j < $scope.frameData.measures.length; j++){
        var mPage = {index:j, measureID: $scope.frameData.measures[j].measureID, visitstatus:visitstatus.UNVISITED};
        pages.measurePages.push(mPage);
      }

      //reset visit statuses
      pages.customizePages[0].visitstatus = visitstatus.CURRENT;
      pages.measurePages[0].visitstatus = visitstatus.CURRENT;

      //set our current pages to the beginning
      curPage.page[$scope.pageType.CUSTOMIZE] = pages.customizePages[0];
      curPage.page[$scope.pageType.MEASURE] = pages.measurePages[0];

    }

    //Initialize the page - called on pageLoad
    function init() {

      //redirect if we have no wheelchair to edit
      if (User.getcurEditWheelchair() === null) {
        $location.path('frame');
      }

      $scope.frameData = FrameData.getFrame(User.getcurEditWheelchair().getFrameID());
      generatePages();
      refreshPreviewImage();
    }

    init(); //Initialize the page

    /****************Weight and Price******************/

    //Calculated Total Weight and Price

    //mark: wheelchairFactory.getTotalWeight
    $scope.getTotalWeight = function () {
      User.getcurEditWheelchair().getTotalWeight();
    };

      //mark: wheelchairFactory.getTotalPrice
      $scope.getTotalPrice = function () {
        User.getcurEditWheelchair().getTotalPrice();
    };

    /*******************Unit Systems ****************************/

    $scope.unitSysList = [
      {
        name: 'Metric',
        enumVal: $scope.unitSys.METRIC
      },
      {
        name: 'Imperial',
        enumVal: $scope.unitSys.IMPERIAL
      }];

    //Returns the appropriate weight unit name
    $scope.getCurUnitSysWeightName = function () {
      switch ($scope.curUnitSys) {
        case $scope.unitSys.IMPERIAL:
          return 'lbs';
        case $scope.unitSys.METRIC:
          return 'kg';
        default:
          return 'weight units';
      }
    };

    //Returns the factor used to convert from lbs to given weight unit
    $scope.getWeightFactor = function (unitSys) {
      switch (unitSys) {
        case $scope.unitSys.IMPERIAL:
          return 1;
        case $scope.unitSys.METRIC:
          return 0.453592;
        default:
          return 1;
      }
    };

    /*******************Wheelchair Preview & Rotation***********************/

    //Returns the angle as a String

    //mark cancelout :: replace angleService
    function getAngleName(angle) {
      switch (angle) {
        case angleType.FRONT:
          return 'Front';
        case angleType.FRONTRIGHT:
          return 'FrontRight';
        case angleType.RIGHT:
          return 'Right';
        case angleType.BACK:
          return 'Back';
        case angleType.BACKRIGHT:
          return 'BackRight';
        default:
          return '';
      }
    }

    //Generates a URL for the given part based on the frame, partID,
    //OptionID, ColorID, SubImageIndex, and Angle
    function getPartPreviewImageURL(curWheelchairPart, subImageIndex) {
      var frameIDString = ''+$scope.frameData.frameID;
      var partIDString = '' + curWheelchairPart.partID;

      var optionIDString =     curWheelchairPart.optionID;
      var colorString    = '_' + curWheelchairPart.colorID;
      var subIndString   = '_' + subImageIndex;
      var angleString    = '_' + getAngleName(curAngle);
      var partURL = previewBaseURL + 'frame' + frameIDString + '/';
      partURL += 'part' + partIDString + '/';
      partURL += optionIDString + colorString + subIndString + angleString + previewImageType;

      return partURL;

      //FrameID = 0
      //PartID = 1
      //OptionID = 2
      //ColorID = 3
      //SubImageIndex = 4
      //CurAngle = FRONT
      //    CREATES
      //'baseURL/frame1/part1/2_3_4_Front.png'
    }

    //Returns an array of imagesURLs to be displayed
    //stacked from first to last (Ascending z-index order)
    function getCurWheelchairImages (){
      var imgs = [];
      //Generate array of images with zRank's
      for (var i = 0; i < curWheelchair.parts.length; i++) {
        var curPart = curWheelchair.parts[i];
        var curPartData = getPartData(curPart.partID);
        var numSubImages = curPartData.numSubImages;
        for (var j = 0; j < numSubImages; j++) {
          imgs.push({
            URL: getPartPreviewImageURL(curPart, j),
            zRank: curPartData.zRank[j][curAngle]
          });
        }
      }

      //Sort array by zRanks
      imgs.sort(function (a, b) {
        return (a.zRank - b.zRank);
      });

      return imgs;
    }

    //Updates the preview image array after a value is changed
    function refreshPreviewImage() {
      $scope.previewImgs = User.getcurEditWheelchair().getPreviewImages();
    }

    //Changes curAngle based on dir (dir = +-1)
    $scope.rotatePreview = function (dir) {
      curAngle = curAngle + dir;
      if (curAngle < 0) {
        curAngle = angleType.numAngles - 1;
      }
      if (curAngle >= angleType.numAngles) {
        curAngle = 0;
      }
      refreshPreviewImage();
    };

    /****************Page Functions******************/
    $scope.getCurPages = function () {
      if (curPage.type === $scope.pageType.CUSTOMIZE) {

        return pages.customizePages;
      }

      return pages.measurePages;
    };
    $scope.getCustomizePages = function () { return pages.customizePages; };
    $scope.getMeasurePages = function () { return pages.measurePages; };

    $scope.getCurPage = function () { return curPage.page[curPage.type]; };
    $scope.getCurCustomizePage = function () {  return curPage.page[$scope.pageType.CUSTOMIZE]; };
    $scope.getCurMeasurePage = function () { return curPage.page[$scope.pageType.MEASURE]; };

    $scope.getCurPageType = function () { return curPage.type; };

    ////Returns the current part from FrameData based on curPage.page[CUSTOMIZE].ID
    ////mark: updated to be used with factories
      $scope.getCurPartData = function () { return $scope.frameData.getPart($scope.getCurCustomizePage().partID) };
    //
    ////Returns the current part from curWheelchair based on curPage.page[CUSTOMIZE].ID
    ////mark: updated to be used with factories.
      $scope.getCurWheelchairPart = function () { return User.getcurEditWheelchair().getPart($scope.getCurCustomizePage().partID); };
    //
    ////Returns the current measure from FrameData based on curPage.page[MEASURE].ID
    ////mark: updated to be used with factories.
      $scope.getCurMeasureData = function () { return $scope.frameData.getMeasure($scope.getCurMeasurePage().measureID) };
    //
    ////Returns the current measure from curWheelchair based on curPage.page[MEASURE].ID
    ////mark: updated to be used with factories.
      $scope.getCurWheelchairMeasure = function () { return User.getcurEditWheelchair().getMeasure($scope.getCurMeasurePage().measureID); };

    $scope.setCurPageType = function (newType) { curPage.type = newType; };

    $scope.setCurPage = function (newIndex) { curPage.page[curPage.type] = $scope.getCurPages()[newIndex]; };
    $scope.setCurCustomizePage = function (newIndex) { curPage.page[$scope.pageType.CUSTOMIZE] = pages.customizePages[newIndex]; };
    $scope.setCurMeasurePage = function (newIndex) { curPage.page[$scope.pageType.MEASURE] = pages.measurePages[newIndex]; };

    /**************** Frame Data Functions ******************/

    //function getPartData(id) {
    //  for (var i = 0; i < $scope.frameData.parts.length; i++) {
    //    var curPart = $scope.frameData.parts[i];
    //    if (curPart.partID === id) {
    //      return curPart;
    //    }
    //  }
    //  return null;
    //}
    //
    //function getWheelchairPart(id) {
    //  for (var i = 0; i < curWheelchair.parts.length; i++) {
    //    var curPart = curWheelchair.parts[i];
    //    if (curPart.partID === id) {
    //      return curPart;
    //    }
    //  }
    //  return null;
    //}
    //
    //function getOptionData(id, curPart) {
    //
    //  for (var j = 0; j < curPart.options.length; j++) {
    //    var curOption = curPart.options[j];
    //    if (curOption.optionID === id) {
    //      return curOption;
    //    }
    //  }
    //
    //  return null;
    //}
    //
    //function getMeasureData(id) {
    //  for (var i = 0; i < $scope.frameData.measures.length; i++) {
    //    var curMeas = $scope.frameData.measures[i];
    //    if (curMeas.measureID === id) {
    //      return curMeas;
    //    }
    //  }
    //  return null;
    //}
    //
    //function getWheelchairMeasure(id) {
    //  for (var i = 0; i < curWheelchair.measures.length; i++) {
    //    var curMeas = curWheelchair.measures[i];
    //    if (curMeas.measureID === id) {
    //      return curMeas;
    //    }
    //  }
    //  return null;
    //}
    //
    //function getColorByName (colorName, curOption) {
    //  for (var i=0; i< curOption.colors.length; i++) {
    //    if (curOption.colors[i].name === colorName) {
    //      return curOption.colors[i];
    //    }
    //  }
    //}
    //
    //$scope.getColorByID = function (colorID, curOption) {
    //  for (var i = 0; i < curOption.colors.length; i++) {
    //    if (curOption.colors[i].colorID === colorID) {
    //      return curOption.colors[i];
    //    }
    //  }
    //};

    /****************Measure Carousel****************/
    $scope.selectedMeasureImageIndex = 0;

    $scope.resetSelectedMeasureImageIndex = function () {
      $scope.selectedMeasureImageIndex = 0;
    };

    $scope.setSelectedMeasureImageIndex = function (imageIndex) {
      $scope.selectedMeasureImageIndex = imageIndex;
    };

    function hasNextSelectedMeasureImageIndex () {
      var len = $scope.getCurMeasureData().imageURLs.length;
      return ($scope.selectedMeasureImageIndex + 1 < len);
    }

    function hasPrevSelectedMeasureImageIndex () {
      return ($scope.selectedMeasureImageIndex - 1 >= 0);
    }

    $scope.setNextSelectedMeasureImageIndex = function () {
      if (hasNextSelectedMeasureImageIndex()) {
        $scope.selectedMeasureImageIndex += 1;
      } else {
        $scope.selectedMeasureImageIndex = 0;
      }
    };

    $scope.setPrevSelectedMeasureImageIndex = function () {
      if (hasPrevSelectedMeasureImageIndex()) {
        $scope.selectedMeasureImageIndex -= 1;
      } else {
        $scope.selectedMeasureImageIndex = $scope.getCurMeasureData().imageURLs.length-1;
      }
    };


    /****************ProgressBar******************/
      //Called by SideBarHeader left arrow OnClick (works similar to secSwitchClick)
    $scope.secSwitchLeft = function (){
      $scope.getCurPage().visitstatus = visitstatus.VISITED;
      $scope.setCurPage($scope.getCurPage().index - 1);
      $scope.getCurPage().visitstatus = visitstatus.CURRENT;
      $scope.closeAllPanels();
      if ($scope.getCurPageType() === $scope.pageType.MEASURE) {
        $scope.resetSelectedMeasureImageIndex();
      }
    };

    //Called by SideBarHeader right arrow OnClick (works similar to secSwitchClick)
    $scope.secSwitchRight = function (){
      $scope.getCurPage().visitstatus = visitstatus.VISITED;
      $scope.setCurPage($scope.getCurPage().index + 1);
      $scope.getCurPage().visitstatus = visitstatus.CURRENT;
      $scope.closeAllPanels();
      if ($scope.getCurPageType() === $scope.pageType.MEASURE) {
        $scope.resetSelectedMeasureImageIndex();
      }
    };

    //Called by progressbar section OnClick
    $scope.secSwitchClick = function(page){
      $scope.getCurPage().visitstatus = visitstatus.VISITED; //set current page to visit status: visited
      $scope.setCurPage(page.index); //set new current page
      $scope.getCurPage().visitstatus = visitstatus.CURRENT; //set new current page to visit status : current
      $scope.closeAllPanels(); //close any panels we may have opened
      if ($scope.getCurPageType() === $scope.pageType.MEASURE) { //resets the selected image in the measure panel
        $scope.resetSelectedMeasureImageIndex();
      }
    };

    //Returns the proper image for the progress bar segment based on visit status
    $scope.getProgBarImage = function (page) {
      if (page.index === 0) {
        if (page.visitstatus === visitstatus.UNVISITED) {
          return ('images/progress_bar/progress_bar_front_link.png');
        }
        if (page.visitstatus === visitstatus.VISITED) {
          return ('images/progress_bar/progress_bar_front_visited.png');
        }
        if (page.visitstatus === visitstatus.CURRENT) {
          return ('images/progress_bar/progress_bar_front_clicked.png');
        }
      }
      else {
        if (page.visitstatus === visitstatus.UNVISITED) {
          return ('images/progress_bar/progress_bar_link.png');
        }
        if (page.visitstatus === visitstatus.VISITED) {
          return ('images/progress_bar/progress_bar_visited.png');
        }
        if (page.visitstatus === visitstatus.CURRENT){
          return ('images/progress_bar/progress_bar_clicked.png');
        }
      }
    };

    //Causes a progressBar segment's tooltip to be visible
    $scope.progressSegmentHoverIn = function () {
      this.showProgressSegmentTooltip = true;
    };

    //Causes a progressBar segment's tooltip to be invisible
    $scope.progressSegmentHoverOut = function () {
      this.showProgressSegmentTooltip = false;
    };

    //Determine the text for each tooltip to display
    $scope.getProgressBarSegmentTooltipText = function (page) {
      if (curPage.type === $scope.pageType.CUSTOMIZE){
        console.log(JSON.stringify(User.getcurEditWheelchair().getPart(page.partID)));
        return User.getcurEditWheelchair().getPart(page.partID).name;}
      else if (curPage.type === $scope.pageType.MEASURE){
        return User.getcurEditWheelchair().getMeasure(page.partID).name;}
      return 'ERROR: Invalid page type';
    };

    /*****************Sidebar Tabs***************/
    $scope.switchPageType = function (newPageType) {
      $scope.setCurPageType(newPageType);
      $scope.getCurPage().visitstatus = visitstatus.CURRENT;
    };

    /*****************Building CurWheelchair*****/
      //mark: replace previewImageFactory: setOptionForPart

    $scope.setCurOption = function (newOptionID) {
      User.getcurEditWheelchair().setOptionForPart($scope.getCurPartData().partID, newOptionID);
      refreshPreviewImage();
    };

    //  //mark replace: wheelchairFactory: setOptionForPart
    //function setOptionForPart(partID, newOptionID) {
    //  var part = getWheelchairPart(partID);
    //  if (part.optionID !== newOptionID) {
    //    part.optionID = newOptionID;
    //
    //
    //    //var colorOptions = (getOptionData(newOptionID,getPartData(partID))).colors;
    //    part.colorID = getOptionData(newOptionID, getPartData(partID)).defaultColorID;
    //    part.price = getOptionData(newOptionID, getPartData(partID)).price;
    //    part.weight = getOptionData(newOptionID, getPartData(partID)).weight;
    //  }
    //}

    $scope.setCurOptionColor = function (newColorID) {
      if ($scope.getCurPanelID() === $scope.getCurWheelchairPart().optionID) {
        User.getcurEditWheelchair().setColorForPart($scope.getCurWheelchairPart().partID, newColorID);
        refreshPreviewImage();

      }
    };

    //function setColorForPartOption(partID, newColorID) {
    //  var part = getWheelchairPart(partID);
    //  part.colorID = newColorID;
    //}

    /*****************Panels*********************/

    //Indicates the current panel
    //ID = -1 indicates no panel open
    var curPanel = {
      panelID: -1,
      panelType: $scope.panelTypes.COLOR
    };

    //Sets curPanel to the chosen panel
    //Closes the panel if id and type match curPanel
    $scope.setPanel = function (id, type) {
      if ($scope.isPanelSelected(id, type)) {
        curPanel.panelID = -1;
      }
      else {
        curPanel.panelID = id;
      }
      curPanel.panelType = type;
    };

    //Closes any open panel
    $scope.closeAllPanels = function () {
      $scope.setPanel(-1, $scope.panelTypes.COLOR);
    };

    //Check if the panel with the given id and type is selected
    $scope.isPanelSelected = function (id, type) {
      return (curPanel.panelID === id && curPanel.panelType === type);
    };

    //Checks if a panel with the given ID is selected
    $scope.isPanelIDSelected = function (id) {
      return curPanel.panelID === id;
    };

    $scope.getCurPanelID = function () { return curPanel.panelID; };

    /*******************Saving***********************/




    //to be continued on Monday!!!!!!












    //Temporary/Dummy function that returns curWheelchair Data and sends to cart
    $scope.saveDesign = function () {
      var r = window.confirm('Add to cart?');
      if (r === true) {

        var wTitle = prompt('Design Name:', 'My Wheelchair');
        if (wTitle == null) User.getcurEditWheelchair().title = 'My Wheelchair';
        User.getcurEditWheelchair().title = wTitle;
        //TODO: Prompt for saving design to database (if logged in)

        //calculate necessities
        User.getcurEditWheelchair().calcPrice = User.getcurEditWheelchair().getTotalPrice();
        User.getcurEditWheelchair().calcWeight = User.getcurEditWheelchair().getTotalWeight();
        curWheelchair.imgURL = $scope.frameData.imageURL; //TODO needs to actually represent the wheelchair

        alert(JSON.stringify(curWheelchair));

        //TODO: questtion: Do we need to update the curWCindex here?
        //if ($scope.curWheelChairCartIndex === -1) {
        //  //add wheelchair to the cart
        //  cartDataFromDB.splice(cartDataFromDB.length - 1, 0, curWheelchair); //TODO: Something more database-y
        //}
        //else {
        //  //overwrite wheelchair in the cart
        //  cartDataFromDB[$scope.curWheelChairCartIndex] = curWheelchair;
        //}

        //redirect user to the cart
        $location.path('cart');
      }
    };

    /*****************General Use Functions*********************/

    //trims a string with an ellipsis if it is longer than len
    $scope.ellipsisFormat = function(str, len) {
      if (str.length > len) {
        return str.substring(0,len) + '...';
      }
      else {
        return str;
      }
    };

    //returns the full string for the title, but only if necessary   ( similar to ellipsisFormat() )
    $scope.titleForEllipsis = function(str, len) {
      if (str.length > len) {
        return str;
      }
      else {
        return '';
      }
    };

  }]);


//pages example:

//var pages = {
//  customizePages: [
//    { index: 0, partID: 0, visitstatus: visitstatus.CURRENT },
//    { index: 1, partID: 3, visitstatus: visitstatus.UNVISITED },
//    { index: 2, partID: 2, visitstatus: visitstatus.UNVISITED },
//    { index: 3, partID: 1, visitstatus: visitstatus.UNVISITED },
//    { index: 4, partID: 4, visitstatus: visitstatus.UNVISITED },
//    { index: 5, partID: 5, visitstatus: visitstatus.UNVISITED },
//    { index: 6, partID: 6, visitstatus: visitstatus.UNVISITED },
//    { index: 7, partID: 7, visitstatus: visitstatus.UNVISITED },
//    { index: 8, partID: 8, visitstatus: visitstatus.UNVISITED },
//    { index: 9, partID: 9, visitstatus: visitstatus.UNVISITED },
//    { index: 10, partID: 10, visitstatus: visitstatus.UNVISITED },
//    { index: 11, partID: 11, visitstatus: visitstatus.UNVISITED }
//  ],
//  measurePages: [
//    { index: 0, measureID: 1, visitstatus: visitstatus.CURRENT },
//    { index: 1, measureID: 5, visitstatus: visitstatus.UNVISITED },
//    { index: 2, measureID: 2, visitstatus: visitstatus.UNVISITED },
//    { index: 3, measureID: 3, visitstatus: visitstatus.UNVISITED },
//    { index: 4, measureID: 4, visitstatus: visitstatus.UNVISITED },
//    { index: 5, measureID: 6, visitstatus: visitstatus.UNVISITED }
//  ]
//};

//CurWheelchair Example:

/*
 curWheelchair = {
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
 };
 */
