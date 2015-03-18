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

    /*********************Unscoped Variables Constants and Enums*******************************/

    //The visitation status for pages/parts
    var visitstatus = {
      VISITED: 'visited',
      UNVISITED: 'unvisited',
      CURRENT: 'current'
    };

    //The angle type of the wheelchair image
    var angleType = {
      BACK : 0,
      BACKRIGHT : 1,
      RIGHT : 2,
      FRONT : 3,
      FRONTRIGHT : 4
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
      name: 'tiArrow Standard',
      desc: 'The standard frame produced by tiArrow.',
      parts: [
        {
          partID: 0,
          name: 'Frame Style',
          numSubImages: 1,
          zRank: [[1, 2, 3, 4, 5]],
          options: [
            {
              optionID: 0,
              name: 'Heavy Duty',
              price: 20,
              weight: 4,
              desc: 'For Fattys',
              thumbnailURL: "images/d_panel_1.png",
              colors: [
                {
                  colorID: 0,
                  name: 'Red',
                  hex: '#E7331A'
                },
                {
                  colorID: 1,
                  name: 'Green',
                  hex: '#2CA635'
                },
                {
                  colorID: 2,
                  name: 'Blue',
                  hex: '#075EDA'
                },
                {
                  colorID: 3,
                  name: 'Magenta',
                  hex: '#FF00FF'
                },
                {
                  colorID: 4,
                  name: 'Yellow',
                  hex: '#FFFF00'
                }
              ]
            }
          ]
        },
        {
          partID: 3,
          name: 'Wheels',
          numSubImages: 2,
          zRank: [[1, 2, 3, 4, 5], [1, 2, 3, 4, 5]],
          options: [
            {
              optionID: 2,
              name: 'Super Ultra Spinning Wheels of Awesomeness Deluxe Alpha 3D',
              price: 200,
              weight: 6,
              desc: 'Crazy Extremetastic',
              thumbnailURL: "images/d_panel_1.png",
              colors: null
            },
            {
              optionID: 4,
              name: 'sWheel',
              price: 2000,
              weight: 4,
              desc: 'An ultra-extreme light wheel',
              thumbnailURL: "images/d_panel_1.png",
              colors: null
            },
            {
              optionID: 5,
              name: 'Expensive sWheel',
              price: 4000,
              weight: 4,
              desc: 'The same as the normal sWheel - but more expensive.  You wouldn\'t want to look like a plebian now would you?',
              thumbnailURL: "images/d_panel_1.png",
              colors: null
            }
          ]
        }
      ],
      measures: [
        {
          measureID: 1,
          name: 'Rear Seat Height',
          desc: 'Distance from ground to back corner of seat',
          measureOptions: ['12', '13', '14', '15', '16'],
          tip: 'Important fators to think about when measuring rear seat height are <strong>body stability</strong> and <strong>shoulder strain</strong>',
          videoURL: 'https://www.youtube.com/embed/pcY2bR7MPVo',
          imageURLs: ['rear-seat-height1.jpg', 'rear-seat-height2.jpg', 'rear-seat-height3.jpg'],
          gifURL: '',
          details: 'Here are some helpful details'
        },
        {
          measureID: 5,
          name: 'Wheel Radius',
          desc: 'The <strong>radius</strong> of the <strong>wheel</strong>',
          measureOptions: ['100', '200', '500', '1000', '1E8'],
          tip: 'Don\'t set this to 0 or you\'ll just get a regular chair',
          videoURL: 'https://www.youtube.com/embed/HCp3_jaYOZ4',
          imageURLs: ['rear-seat-height2.jpg', 'rear-seat-height1.jpg'],
          gifURL: '',
          details: 'This set of details is not helpful in the slightest: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vehicula, erat at sollicitudin gravida, diam lacus maximus sem, non viverra eros nisi et quam. Nulla ornare eleifend mattis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris metus justo, hendrerit id lorem in, rhoncus tincidunt risus. Maecenas consequat mollis ligula ac ornare. Sed laoreet ipsum eget quam ornare sagittis. Suspendisse fermentum ultrices justo eu egestas. Vivamus egestas semper nibh, vitae malesuada turpis lacinia ac. Nam condimentum ornare interdum. Phasellus sed euismod ligula. Vivamus volutpat nulla a diam consequat eleifend. Morbi semper magna at odio ultrices condimentum. Phasellus porttitor dictum pretium.'
        }
      ]
    };

    /***********Variables**************/
    $scope.frameData = dummyFrameData; //DATA PULLED FROM DATABASE
    var pages = dummyPages; //Array representing customization page

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

    /*******************Wheelchair Preview & Rotation***********************/
    var angle = angleType.FRONT;

    //Returns the angle as a String
    function getAngleName(angle) {
        switch (angle) {
            case angleType.FRONT:
                return "Front";
            case angleType.FRONTRIGHT:
                return "FrontRight";
            case angleType.RIGHT:
                return "Right";
            case angleType.BACK:
                return "Back";
            case angleType.BACKRIGHT:
                return "BackRight";
            default:
                return "";
        }
    };

    var baseURL = "images/chairPic/";
    var imageType = ".png";

    //Generates a URL for the given part based on the frame, partID,
    //OptionID, ColorID, SubImageIndex, and Angle
    function getPartPreviewImageURL(curWheelchairPart, subImageIndex) {
        var frameIDString = ""+$scope.frameData.frameID;
        var partIDString = "" + curWheelchairPart.partID;

        var optionIDString =     curWheelchairPart.optionID;
        var colorString    = "_" + curWheelchairPart.colorID;
        var subIndString   = "_" + subImageIndex;
        var angleString    = "_" + getAngleName(angle);

        var partURL = baseURL + "frame" + frameIDString + "/";
        partURL += "Part" + partIDString + "/";
        partURL += optionIDString + colorString + subIndString + angleString + imageType;
        return partURL;

        //FrameID = 0
        //PartID = 1
        //OptionID = 2
        //ColorID = 3
        //SubImageIndex = 4
        //Angle = FRONT
        //    CREATES
        //"baseURL/frame0/part1/2_3_4_Front.png"
    };

    //Keeps track of previous memory of image for Angular's sake
    var oldImgs = null;

    //Returns an array of imagesURLs to be displayed
    //stacked from first to last (Ascending z-index order)
    $scope.getCurWheelchairImages = function () {
        var imgs = [];

        //Generate array of images with zRank's
        for (var i = 0; i < $scope.curWheelchair.parts.length; i++) {
            var curPart = $scope.curWheelchair.parts[i];
            var curPartData = getPartData(curPart.partID);
            var numSubImages = curPartData.numSubImages;
            for (var j = 0; j < numSubImages; j++) {
                imgs.push({
                    url: getPartPreviewImageURL(curPart, j),
                    zRank: curPartData.zRank[j][angle]
                });
            }
        }

        //Sort array by zRanks
        imgs.sort(function (a, b) {
            return (a.zRank - b.zRank);
        });

        //Keep old values for Angular's $digest 
        //since img is not the same memory address as oldImg, Angular continuously reloads img until it crashes
        //If img doesn't change, simply reload the old memory for Angular
        if (imgsUnchanged(imgs, oldImgs)) {
            imgs = oldImgs;
        }
        oldImgs = imgs;

        return imgs;
    };

    //Check if the contents of newImgs are equal to oldImgs
    function imgsUnchanged(newImgs, oldImgs) {
        if (newImgs === null || oldImgs === null)
            return false;
        if (newImgs.length !== oldImgs.length)
            return false;
        for (var i = 0; i < newImgs.length; i++)
        {
            if (newImgs[i].url !== oldImgs[i].url)
                return false;
        }
        return true;
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
        if (curPart.partID === id) {
          return curPart;
        }
      }
      return null;
    }

    function getWheelchairPart(id) {
      for (var i = 0; i < $scope.curWheelchair.parts.length; i++) {
        var curPart = $scope.curWheelchair.parts[i];
        if (curPart.partID === id) {
          return curPart;
        }
      }
      return null;
    }

    function getOptionData(id) {
      for (var i = 0; i < $scope.frameData.parts.length; i++) {
        var curPart = $scope.frameData.parts[i];
        for (var j = 0; j < curPart.options.length; j++) {
          var curOption = curPart.options[j];
          if (curOption.optionID === id) {
            return curOption;
          }
        }
      }
      return null;
    }

    function getMeasureData(id) {
      for (var i = 0; i < $scope.frameData.measures.length; i++) {
        var curMeas = $scope.frameData.measures[i];
        if (curMeas.measureID === id) {
          return curMeas;
        }
      }
      return null;
    }

    function getWheelchairMeasure(id) {
      for (var i = 0; i < $scope.curWheelchair.measures.length; i++) {
        var curMeas = $scope.curWheelchair.measures[i];
        if (curMeas.measureID === id) {
          return curMeas;
        }
      }
      return null;
    }

    function getColorByName (optionID, colorName) {
      var option = getOptionData(optionID);
      for (var i=0; i<option.colors.length; i++) {
        if (option.colors[i].name === colorName) {
          return option.colors[i];
        }
      }
    };

    function getColorByID(optionID, colorID) {
        var option = getOptionData(optionID);
        for (var i = 0; i < option.colors.length; i++) {
            if (option.colors[i].colorID === colorID) {
                return option.colors[i];
            }
        }
    };

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
    };

    function hasPrevSelectedMeasureImageIndex () {
        return ($scope.selectedMeasureImageIndex - 1 >= 0);
    };

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

    /*****************Sidebar Tabs***************/
    $scope.switchPageType = function (newPageType) {
      $scope.setCurPageType(newPageType);
      $scope.getCurPage().visitstatus = visitstatus.CURRENT;
    };

    /*****************Building CurWheelchair*****/

    $scope.setCurOption = function (newOptionID) {
      setOptionForPart($scope.getCurPartData().partID, newOptionID);
    };

    function setOptionForPart(partID, newOptionID) {
      var part = getWheelchairPart(partID);
      if (part.optionID !== newOptionID) {
        part.optionID = newOptionID;
        var colorOptions = (getOptionData(newOptionID)).colors;
        part.colorID = (colorOptions !== null && colorOptions.length > 0) ? colorOptions[0].colorID : 0;
      }
    }

    $scope.setCurOptionColor = function (newColorID) {
      if ($scope.getCurPanelID() === $scope.getCurWheelchairPart().optionID) {
        setColorForPartOption($scope.getCurWheelchairPart().partID, newColorID);
      }
    };

    function setColorForPartOption(partID, newColorID) {
      var part = getWheelchairPart(partID);
      part.colorID = newColorID;
    }

    //returns the thumbnail part option image for the sidebar
    $scope.getPartThumbImage = function (part) {
      var option = getOptionData(part.optionID);
      return option.thumbImage; //TODO: THUMBIMAGE NEEDS TO BE ADDED TO THE JSON FILE
    };

    /*****************Panels*********************/

      //Enumerated type for which panel to show for a given panelID
    $scope.panelTypes = {
      COLOR: 'color',
      DETAIL: 'detail'
    };

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
    $scope.saveDesign = function () {
      window.alert(JSON.stringify($scope.curWheelchair.parts));
      window.alert(JSON.stringify($scope.curWheelchair.measures));
    };

  });
