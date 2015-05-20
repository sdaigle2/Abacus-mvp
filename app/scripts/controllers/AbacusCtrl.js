﻿'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:AbacusCtrl
 * @description
 * # AbacusCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('AbacusCtrl', ['$scope', '$location', 'FrameData', 'User', 'Angles', 'Units',
    function ($scope, $location, FrameData, User, Angles, Units) {

    /*********************Enums*******************************/

    //The visitation status for pages (parts/measures)
    var visitstatus = {
      VISITED: 'visited',
      UNVISITED: 'unvisited',
      CURRENT: 'current'
    };

    //The two states for pages to be in
    $scope.pageType = {
      CUSTOMIZE: 0,
      MEASURE: 1
    };
      
    //The two types of panels that can open from the sidebar
    $scope.panelTypes = {
      COLOR: 'color',
      DETAIL: 'detail'
    };

    /**********************Main Variables****************************/

    //All the data about the current frame (loaded by init)
    $scope.curFrameData = null;

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

    //The current angle the wheelchair is being viewed from
    var curAngle = Angles.angleType.FRONTRIGHT;

    //The current measurement system being used
    $scope.curUnitSys = User.getUnitSys();

    /***************************Initialization****************************/

    //Generates the page arrays inside of pages
    function generatePages (){

      //part customization pages generation
      for (var i = 0; i < $scope.curFrameData.parts.length; i++ ){
        var pPage = {index:i, partID: $scope.curFrameData.parts[i].partID, visitstatus:visitstatus.UNVISITED};
        pages.customizePages.push(pPage);
      }

      //measure pages generation
      for (var j = 0; j < $scope.curFrameData.measures.length; j++){
        var mPage = {index:j, measureID: $scope.curFrameData.measures[j].measureID, visitstatus:visitstatus.UNVISITED};
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
      if (User.getCurEditWheelchair() === null) {
        $location.path('frame');
      }

      //Send the user back to Frames if no curEditWheelchair set
      var curEditWheelchair = User.getCurEditWheelchair();
      if (curEditWheelchair === null) {
        $location.path('frames');
        return;
      }       

      //Load data about the frame type of curEditWheelchair
      $scope.curFrameData = FrameData.getFrame(curEditWheelchair.getFrameID());
      generatePages();
    }

    init(); //Initialize the page

    /****************Weight and Price******************/

    $scope.getTotalWeight = function () {
      return User.getCurEditWheelchair().getTotalWeight();
    };

    $scope.getTotalPrice = function () {
      return User.getCurEditWheelchair().getTotalPrice();
    };

    /*******************Unit Systems ****************************/

    //Options for the Unit System Drop-Down-List
    $scope.unitSysList = [
      {
        name: 'Metric',
        enumVal: Units.unitSys.METRIC
      },
      {
        name: 'Imperial',
        enumVal: Units.unitSys.IMPERIAL
      }];

    //Returns the appropriate weight unit name
    $scope.getCurUnitSysWeightName = function () {
      return Units.getWeightName($scope.curUnitSys);
    };

    //Returns the factor used to convert from lbs to given weight unit
    $scope.getCurUnitSysWeightFactor = function () {
      return Units.getWeightFactor($scope.curUnitSys);
    };

    /*******************Wheelchair Preview & Rotation***********************/

    //Returns an array of images for User.getCurEditWheelchair() sorted by zRank
    $scope.getPreviewImages = function () {
      return User.getCurEditWheelchair().getPreviewImages(curAngle);
    };


    //Changes curAngle based on dir (dir = +-1)
    $scope.rotatePreview = function (dir) {
      curAngle = curAngle + dir;
      if (curAngle < 0) {
        curAngle = Angles.numAngles - 1;
      }
      if (curAngle >= Angles.numAngles) {
        curAngle = 0;
      }
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

    //Returns the current part from curFrameData based on curPage.page[CUSTOMIZE].ID
    $scope.getCurPartData = function () { return $scope.curFrameData.getPart($scope.getCurCustomizePage().partID); };

    //Returns the current part from curEditWheelchair based on curPage.page[CUSTOMIZE].ID
    $scope.getCurWheelchairPart = function () { return User.getCurEditWheelchair().getPart($scope.getCurCustomizePage().partID); };

    //Returns the current measure from curFrameData based on curPage.page[MEASURE].ID
    $scope.getCurMeasureData = function () { return $scope.curFrameData.getMeasure($scope.getCurMeasurePage().measureID); };

    //Returns the current measure from curEditWheelchair based on curPage.page[MEASURE].ID
    $scope.getCurWheelchairMeasure = function () { return User.getCurEditWheelchair().getMeasure($scope.getCurMeasurePage().measureID); };

    $scope.setCurPageType = function (newType) { curPage.type = newType; };

    $scope.setCurPage = function (newIndex) { curPage.page[curPage.type] = $scope.getCurPages()[newIndex]; };
    $scope.setCurCustomizePage = function (newIndex) { curPage.page[$scope.pageType.CUSTOMIZE] = pages.customizePages[newIndex]; };
    $scope.setCurMeasurePage = function (newIndex) { curPage.page[$scope.pageType.MEASURE] = pages.measurePages[newIndex]; };


    /****************Measure Carousel****************/

    //The current index of the image shown in the Measure Carousel
    $scope.curMeasureCarouselIndex = 0;

    function resetSelectedMeasureImageIndex () {
      $scope.selectedMeasureImageIndex = 0;
    }

    //Cycles the carousel in the direction of dir (+-1)
    $scope.rotateMeasureCarouselIndex = function (dir) {
      var len = $scope.getCurMeasureData().getNumImages();
      $scope.curMeasureCarouselIndex += dir;
      if ($scope.curMeasureCarouselIndex >= len) {
        $scope.curMeasureCarouselIndex = 0;
      }
      else if ($scope.curMeasureCarouselIndex < 0) {
        $scope.curMeasureCarouselIndex = len - 1;
      }
    };


    /****************ProgressBar******************/

    //Switches pages left/right based on dir
    $scope.pageSwitchStep = function (dir){
      $scope.getCurPage().visitstatus = visitstatus.VISITED;
      $scope.setCurPage($scope.getCurPage().index + dir);
      $scope.getCurPage().visitstatus = visitstatus.CURRENT;
      $scope.closeAllPanels();
      if ($scope.getCurPageType() === $scope.pageType.MEASURE) {
        resetSelectedMeasureImageIndex();
      }
    };

    //Jump to the given page
    $scope.pageSwitchJump = function(page){
      $scope.getCurPage().visitstatus = visitstatus.VISITED; //set current page to visit status: visited
      $scope.setCurPage(page.index); //set new current page
      $scope.getCurPage().visitstatus = visitstatus.CURRENT; //set new current page to visit status : current
      $scope.closeAllPanels(); //close any panels we may have opened
      if ($scope.getCurPageType() === $scope.pageType.MEASURE) { //resets the selected image in the measure panel
        resetSelectedMeasureImageIndex();
      }
    };

    //Returns the image for the given progress bar segment based on visit status and index
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
        return User.getCurEditWheelchair().getPartDetails(page.partID, 0).partName;}
      else if (curPage.type === $scope.pageType.MEASURE){
        return User.getCurEditWheelchair().getMeasureDetails(page.measureID, 0).name;}
      return 'ERROR: Invalid page type';
    };

    /*****************Sidebar Tabs***************/

    $scope.switchPageType = function (newPageType) {
      $scope.setCurPageType(newPageType);
      $scope.getCurPage().visitstatus = visitstatus.CURRENT;
    };

    /*****************Building CurWheelchair*****/

    $scope.setCurOption = function (newOptionID) {
      User.getCurEditWheelchair().setOptionForPart($scope.getCurPartData().partID, newOptionID);
    };

    $scope.setCurOptionColor = function (newColorID) {
      if ($scope.getCurPanelID() === $scope.getCurWheelchairPart().optionID) {
        User.getCurEditWheelchair().setColorForPart($scope.getCurWheelchairPart().partID, newColorID);
      }
    };

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


    $scope.getCurPanelID = function () {
      return curPanel.panelID;
    };

    /*******************Sidebar Colors***************/

    //Returns true if the current option is selected and has color options
    $scope.isSidebarColored = function (optionID) {
      if (curPage.type !== $scope.pageType.CUSTOMIZE) {
        return;
      }

      var partID = $scope.getCurPage().partID;
      var part = $scope.curFrameData.getPart(partID);
      var option = part.getOption(optionID);
      var wPart = User.getCurEditWheelchair().getPart(partID);

      return (wPart.optionID === optionID) && (option.getNumColors() > 0);
    };

    //Returns a CSS-styled hex string for the given option
    //This should only be called if isSidebarColored returns true
    $scope.getSidebarColor = function (optionID) {
      if (curPage.type !== $scope.pageType.CUSTOMIZE) {
        return;
      }

      var partID = $scope.getCurPage().partID;
      var part = $scope.curFrameData.getPart(partID);
      var option = part.getOption(optionID);
      var wPart = User.getCurEditWheelchair().getPart(partID);

      return option.getColor(wPart.colorID).getHexString();
    };

    /*******************Saving***********************/

    //Saves the current design and updates the database if the user is logged in
    $scope.saveDesign = function () {

      //prompt for wheelchair title
      var wTitle = window.prompt('Design Name:', User.getCurEditWheelchair().getTitle());
      if (wTitle === null) {
        User.getCurEditWheelchair().title = 'My Wheelchair';
      }   
      User.getCurEditWheelchair().title = wTitle;

      //TODO: save the design to the database

      //redirect user to the cart/myDesigns
      $location.path('cart');

    };

    /*****************General Use Functions*********************/

    //Trims a string with an ellipsis if it is longer than len
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
