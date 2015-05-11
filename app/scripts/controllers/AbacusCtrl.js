'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:AbacusCtrl
 * @description
 * # AbacusCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('AbacusCtrl', ['$scope', '$location', 'FrameData', 'User', 'Wheelchair', 'Angles', 'Units',
    function ($scope, $location, FrameData, User, Wheelchair, Angles, Units) {

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

    //The current angle the wheelchair is being viewed from
    var curAngle = Angles.angleType.FRONTRIGHT;

    //The current measurement system being used
    $scope.curUnitSys = User.getUnitSys();

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
      if (User.getCurEditWheelchair() === null) {
        $location.path('frame');
      }

      var curEditWheelchair = User.getCurEditWheelchair();
      if (curEditWheelchair === null) {
        $location.path('frames');
        return;
      }       

      $scope.frameData = FrameData.getFrame(curEditWheelchair.getFrameID());
      generatePages();
    }

    init(); //Initialize the page

    /****************Weight and Price******************/

    //These Calculate the Total Weight and Price

    $scope.getTotalWeight = function () {
      return User.getCurEditWheelchair().getTotalWeight();
    };

    $scope.getTotalPrice = function () {
      return User.getCurEditWheelchair().getTotalPrice();
    };

    /*******************Unit Systems ****************************/

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

    //Returns the current part from FrameData based on curPage.page[CUSTOMIZE].ID
    $scope.getCurPartData = function () { return $scope.frameData.getPart($scope.getCurCustomizePage().partID); };

    //Returns the current part from curWheelchair based on curPage.page[CUSTOMIZE].ID
    $scope.getCurWheelchairPart = function () { return User.getCurEditWheelchair().getPart($scope.getCurCustomizePage().partID); };

    //Returns the current measure from FrameData based on curPage.page[MEASURE].ID
    $scope.getCurMeasureData = function () { return $scope.frameData.getMeasure($scope.getCurMeasurePage().measureID); };

    //Returns the current measure from curWheelchair based on curPage.page[MEASURE].ID
    $scope.getCurWheelchairMeasure = function () { return User.getCurEditWheelchair().getMeasure($scope.getCurMeasurePage().measureID); };

    $scope.setCurPageType = function (newType) { curPage.type = newType; };

    $scope.setCurPage = function (newIndex) { curPage.page[curPage.type] = $scope.getCurPages()[newIndex]; };
    $scope.setCurCustomizePage = function (newIndex) { curPage.page[$scope.pageType.CUSTOMIZE] = pages.customizePages[newIndex]; };
    $scope.setCurMeasurePage = function (newIndex) { curPage.page[$scope.pageType.MEASURE] = pages.measurePages[newIndex]; };


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

    $scope.getCurPanelID = function () { return curPanel.panelID; };


    /*******************Sidebar Colors***************/

    $scope.isSidebarColored = function (optionID) {
      var partID = $scope.getCurPage().partID;
      var part = $scope.frameData.getPart(partID);
      var option = part.getOption(optionID);
      var wPart = User.getCurEditWheelchair().getPart(partID);

      return (wPart.optionID === optionID) && (option.getNumColors() > 0);
    };

    $scope.getSidebarColor = function (optionID) {
      var partID = $scope.getCurPage().partID;
      var part = $scope.frameData.getPart(partID);
      var option = part.getOption(optionID);
      var wPart = User.getCurEditWheelchair().getPart(partID);

      return option.getColor(wPart.colorID).getHexString();
    };

    /*******************Saving***********************/

      $scope.saveDesign = function () {

        //prompt for wheelchair title
        var wTitle = window.prompt('Design Name:', User.getCurEditWheelchair().getTitle());
        if (wTitle === null) {
          User.getCurEditWheelchair().title = 'My Wheelchair';
        }   
        User.getCurEditWheelchair().title = wTitle;

        //TODO save the design to the database

        //redirect user to the cart/myDesigns
        $location.path('cart');

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
