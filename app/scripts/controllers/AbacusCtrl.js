'use strict';

/**
 * @ngdoc function
 * @name abacuApp.controller:AbacusCtrl
 * @description
 * # AbacusCtrl
 * Controller of the abacuApp
 */
angular.module('abacuApp')
  .controller('AbacusCtrl', ['$scope', '$location', 'localJSONStorage', '$routeParams', 'FrameData', 'User', 'Angles', 'Units', 'Drop', 'Design', '_', '$q', 'ngDialog', 'Errors',
    function ($scope, $location, localJSONStorage, $routeParams, FrameData, User, Angles, Units, Drop, Design, _, $q, ngDialog, Errors) {

      Drop.setFalse();
      /*********************Enums*******************************/
      //The visitation status for pages (parts/measures)
      var visitstatus = {
        VISITED: 'visited',
        UNVISITED: 'unvisited',
        CURRENT: 'current',
        Warning: 'warning'
      };

      $scope.saveDropdown = false;

      //The two states for pages to be in
      $scope.pageType = {
        CUSTOMIZE: 0,
        MEASURE: 1
      };


      $scope.MeasureTabs = {
        TUTORIAL: 'tutorial',
        ERGONOMICS: 'ergonomics',
        SUMMARY: 'summary'
      };

      //login panel
      $scope.loginModel = {
        email: '',
        password: ''
      };

      var loginPanelStatus = {
        MAIN:'main',
        LOGIN:'login',
        REGISTER:'register',
        SAVED:'saved',
        UPDATE:'update'
      };

      $scope.loginPanel = loginPanelStatus.MAIN;

      /**********************Main Variables****************************/



      $scope.left_button = 'arrow_left.png';
      $scope.right_button = 'arrow_right.png';
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
      var measureTabs = $scope.MeasureTabs.TUTORIAL;

      //The current measurement system being used
      $scope.curUnitSys = User.getUnitSys();
      $scope.curUnit = null;



      $scope.unityToggle = function (){
        if ($scope.curUnit === true){
            $scope.curUnitSys = $scope.unitSysList[0].enumVal
        }
        if ($scope.curUnit === false) {
          $scope.curUnitSys = $scope.unitSysList[1].enumVal

        }
      }

      $scope.currChairIsNew = User.isNewWheelchair();

      /***************************Initialization****************************/

      //Generates the page arrays inside of pages
      function generatePages() {

        //part customization pages generation
        for (var i = 0; i < $scope.curFrameData.parts.length; i++) {
          var partID = $scope.curFrameData.parts[i].partID
          var optionIndexC = $scope.curEditWheelchair.getOptionIDForPart(partID)
          if(optionIndexC === -1) {
            var pPage = {index: i, partID: partID, visitstatus: visitstatus.UNVISITED};
            pages.customizePages.push(pPage);
          }
          else {
            var pPage = {index: i, partID: partID, visitstatus: visitstatus.VISITED};
            pages.customizePages.push(pPage);
          }
        }

        //measure pages generation
        for (var j = 0; j < $scope.curFrameData.measures.length; j++) {
          var mPage = {
            index: j,
            measureID: $scope.curFrameData.measures[j].measureID,
            visitstatus: visitstatus.UNVISITED
          };
          var optionIndex = $scope.curEditWheelchair.getOptionIndexForMeasure(mPage.measureID);
          if(optionIndex !== -1)
            mPage.visitstatus = visitstatus.VISITED;
          pages.measurePages.push(mPage);
        }

        //set our current pages to the beginning
        curPage.page[$scope.pageType.CUSTOMIZE] = pages.customizePages[0];
        curPage.page[$scope.pageType.MEASURE] = pages.measurePages[0];
      }

      //Initialize the page - called on pageLoad
      function init() {
        var id = parseInt($routeParams.param1);
        console.log(id);
        if(id && FrameData.getFrame(id)) {
          User.createCurrentDesign(id);
        }
        //Send the user back to Frames if no curEditWheelchair set
        $scope.curEditWheelchair = User.getCurEditWheelchair();
        if ($scope.curEditWheelchair === null) {
          $location.path('/frames');
          return;
        }

        //Load data about the frame type of curEditWheelchair
        $scope.curFrameData = FrameData.getFrame($scope.curEditWheelchair.getFrameID());
        generatePages();
      }

      init(); //Initialize the page

      /******login action group*******/
      $scope.login = function () {
        $scope.loginText = 'Loading..';
        $scope.error = '';
        User.login($scope.loginModel.email, $scope.loginModel.password)
          .then(function () {
            $scope.loginText = 'Log In';
            $scope.loginModel.email = '';
            $scope.saveForLater();
            $scope.loginPanel = loginPanelStatus.SAVED;
          }, function (message) {
            $scope.loginText = 'Log In';
            $scope.error = message;
          });
        $scope.loginModel.password = '';
      };

      $scope.register = function(){
        $scope.loginPanel = loginPanelStatus.REGISTER;
      };

      //register group
      $scope.registerAction = function(){
        $scope.error = '';
        $http({
          url: '/register'
          , data: $scope.accountModel
          , method: 'POST'
        }).success(function (data) {
          console.log(data);
          if(data.err) {
            $scope.error = data.err;
            if(data.field === 'password'){
              $scope.accountModel.password = '';
              $scope.accountModel.confirm = '';
            }
            else
            if(data.field === 'email'){
              $scope.accountModel.email = '';
            }
          }
          else {
            User.login($scope.accountModel.email, $scope.accountModel.password);
            $scope.saveForLater();
            $scope.loginPanel = loginPanelStatus.SAVED;
          }
        })
          .error(function (data) {
            console.log('Request Failed: ' + data);
            deferred.reject('Error loading user data');
          });

      };

      $scope.saveMessage = function(){
        User.setContentSection('measurements');
        $location.path('/settings');
      };

      //redirect
      $scope.backToMain = function(){
        $scope.loginPanel = loginPanelStatus.MAIN;
      };

      $scope.backToLogin = function(){
        $scope.loginPanel = loginPanelStatus.LOGIN;
      };

      $scope.backToMain = function(){
        $scope.loginPanel = loginPanelStatus.MAIN;
      };

      /****************Weight and Price******************/

      $scope.getTotalWeight = function () {
        return $scope.curEditWheelchair.getTotalWeight();
      };

      $scope.getTotalPrice = function () {
        return $scope.curEditWheelchair.getTotalPrice();
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

      if($scope.curUnitSys === $scope.unitSysList[0].enumVal){
        $scope.curUnit = false;
      }else {
        $scope.curUnit =true;}

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
        return $scope.curEditWheelchair.getPreviewImages(curAngle);
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
        //.concat(pages.customizePages);
      };
      $scope.getCustomizePages = function () {
        return pages.customizePages;
      };
      $scope.getMeasurePages = function () {
        return pages.measurePages;
      };

      $scope.getCurPage = function () {
        return curPage.page[curPage.type];
      };
      $scope.getCurCustomizePage = function () {
        return curPage.page[$scope.pageType.CUSTOMIZE];
      };
      $scope.getCurMeasurePage = function () {
        return curPage.page[$scope.pageType.MEASURE];
      };

      $scope.getCurPageType = function () {
        return curPage.type;
      };

      $scope.isInMPage = function (){
        return $scope.getCurPageType() == $scope.pageType.MEASURE;
      };

      //Returns the current part from curFrameData based on curPage.page[CUSTOMIZE].ID
      $scope.getCurPartData = function () {
        return $scope.curFrameData.getPart($scope.getCurCustomizePage().partID);
      };

      //Returns the current part from curEditWheelchair based on curPage.page[CUSTOMIZE].ID
      $scope.getCurWheelchairPart = function () {
        return $scope.curEditWheelchair.getPart($scope.getCurCustomizePage().partID);
      };

      //Returns the current measure from curFrameData based on curPage.page[MEASURE].ID
      $scope.getCurMeasureData = function () {
        return $scope.curFrameData.getMeasure($scope.getCurMeasurePage().measureID);
      };

      //Returns the current measure from curEditWheelchair based on curPage.page[MEASURE].ID
      $scope.getCurWheelchairMeasure = function () {
        return $scope.curEditWheelchair.getMeasure($scope.getCurMeasurePage().measureID);
      };

      $scope.setCurPageType = function (newType) {
        curPage.type = newType;
      };

      $scope.setCurPage = function (newIndex) {
        curPage.page[curPage.type] = $scope.getCurPages()[newIndex];
      };
      $scope.setCurCustomizePage = function (newIndex) {
        curPage.page[$scope.pageType.CUSTOMIZE] = pages.customizePages[newIndex];
      };
      $scope.setCurMeasurePage = function (newIndex) {
        curPage.page[$scope.pageType.MEASURE] = pages.measurePages[newIndex];
      };





      /****************Measure Carousel****************/

        //The current index of the image shown in the Measure Carousel
      $scope.curMeasureCarouselIndex = 0;

      function resetSelectedMeasureImageIndex() {
        $scope.curMeasureCarouselIndex = 0;
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

      //Directly jumps the carousel to the given index
      $scope.jumpMeasureCarouselIndex = function (index) {
        $scope.curMeasureCarouselIndex = index;
      };


      /*************measurement page tab switch  ******/

      $scope.getMeasureTabs = function () {
        return measureTabs;
      };

      $scope.setMeasureTabs = function (newSection) {
        measureTabs = newSection;
      };


      /****************ProgressBar******************/

        //Switches pages left/right based on dir
      $scope.pageSwitchStep = function (dir) {
        if ($scope.getCurPageType() === $scope.pageType.MEASURE && dir === -1 && $scope.getCurPage().index === 0) {
          $scope.setCurPageType($scope.pageType.CUSTOMIZE);
          //set to customize
          $scope.getCurPage().visitstatus = visitstatus.VISITED;
          $scope.setCurPage(pages.customizePages.length - 1);
        }
        else if ($scope.getCurPageType() === $scope.pageType.CUSTOMIZE && dir === 1 && $scope.getCurPage().index === pages.customizePages.length - 1) {
          $scope.setCurPageType($scope.pageType.MEASURE);
          //set to measure

          if($scope.getCurWheelchairMeasure().measureOptionIndex !== -1)
            $scope.getCurPage().visitstatus = visitstatus.VISITED;
          else
            $scope.getCurPage().visitstatus = visitstatus.UNVISITED;
          $scope.setCurPage(0);
        }
        else {
          if($scope.getCurWheelchairMeasure().measureOptionIndex !== -1 || $scope.getCurPageType() === $scope.pageType.CUSTOMIZE)
            $scope.getCurPage().visitstatus = visitstatus.VISITED;
          else
            $scope.getCurPage().visitstatus = visitstatus.UNVISITED;
          $scope.setCurPage($scope.getCurPage().index + dir);
        }
        $scope.getCurPage().visitstatus = visitstatus.CURRENT;
        $scope.closeAllPanels();
        resetSelectedMeasureImageIndex();
        navigateArrows(dir)
        $scope.setMeasureTabs($scope.MeasureTabs.TUTORIAL);
      };




      //Jump to the given page
      $scope.pageSwitchJump = function (page) {
        if($scope.getCurWheelchairMeasure().measureOptionIndex !== -1 || $scope.getCurPageType() === $scope.pageType.CUSTOMIZE)
          $scope.getCurPage().visitstatus = visitstatus.VISITED;
        else
          $scope.getCurPage().visitstatus = visitstatus.UNVISITED;  //set current page to visit status: visited
        $scope.setCurPage(page.index); //set new current page
        $scope.getCurPage().visitstatus = visitstatus.CURRENT; //set new current page to visit status : current
        $scope.closeAllPanels(); //close any panels we may have opened
        if ($scope.getCurPageType() === $scope.pageType.MEASURE) { //resets the selected image in the measure panel
          resetSelectedMeasureImageIndex();
          $scope.setMeasureTabs($scope.MeasureTabs.TUTORIAL);
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
          if (page.visitstatus === visitstatus.CURRENT) {
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
        if (curPage.type === $scope.pageType.CUSTOMIZE) {
          return $scope.curEditWheelchair.getPartDetails(page.partID, 0).partName;
        }
        else if (curPage.type === $scope.pageType.MEASURE) {
          return $scope.curEditWheelchair.getMeasureDetails(page.measureID, 0).name;
        }
        return 'ERROR: Invalid page type';
      };

      $scope.getCustomizeTooltipText = function (page){
           return $scope.curEditWheelchair.getPartDetails(page.partID, 0).partName;
      }

      $scope.getMeasurementTooltipText = function (page){
          return $scope.curEditWheelchair.getMeasureDetails(page.measureID, 0).name;
      }

      /*********Save $ review Dropdown*********/


      $scope.saveDropDown = function() {
        $scope.saveDropdown = true;
        console.log('im opening')
      };

      $scope.closeSaveDropDown = function () {
        $scope.saveDropdown = false;
        $scope.loginPanel = loginPanelStatus.MAIN;
      };


      /****complete check function ***/

      //complete check on HTML
      $scope.completed = function() {
        for(var i=0; i<pages.measurePages.length; i++){
          var optionIndexM = $scope.curEditWheelchair.getOptionIndexForMeasure(pages.measurePages[i].measureID);
          if (optionIndexM === -1){
            return pages.measurePages[i];
          }
        }
        return null;
      };

      $scope.completedC = function() {
        for(var i=0; i<pages.customizePages.length; i++) {
          var optionIndexC = $scope.curEditWheelchair.getOptionIDForPart(pages.customizePages[i].partID);
          if (optionIndexC === -1) {
            return pages.customizePages[i];
          }
        }

        return null;
      };

      //Complete check for save to design function:  Return null if all measures are set, otherwise return page for first unset measure
      $scope.completedCheck = function() {
        var unfinishedPages = [];
        for(var i=0; i<pages.measurePages.length; i++){
          var optionIndexM = $scope.curEditWheelchair.getOptionIndexForMeasure(pages.measurePages[i].measureID);

          if(optionIndexM === -1){
            unfinishedPages.push(pages.measurePages[i]);
          }
        }

        for(var i = 0; i < unfinishedPages.length; i++){
          unfinishedPages[i].visitstatus = visitstatus.CURRENT
        }
        return unfinishedPages;
      };

      $scope.completePercentage = function (){
        var completeNum = ($scope.completedCheck()).length;
        var total = pages.customizePages.length + pages.measurePages.length;
        return Math.round((total - completeNum) / total * 100);
      };


      /*****************Sidebar Tabs***************/

      $scope.switchPageType = function (newPageType) {
        $scope.closeAllPanels();
        $scope.setCurPageType(newPageType);
        $scope.getCurPage().visitstatus = visitstatus.CURRENT;
      };

      /*****************Building CurWheelchair*****/

      $scope.setCurOption = function (newOptionID) {
        $scope.curEditWheelchair.setOptionForPart($scope.getCurPartData().partID, newOptionID);
        console.log('Changed option');
      };

      $scope.setCurOptionColor = function (newColorID) {
        console.log($scope.getCurPanelID());
        if ($scope.getCurPanelID() === $scope.getCurWheelchairPart().optionID) {
          $scope.curEditWheelchair.setColorForPart($scope.getCurWheelchairPart().partID, newColorID);
          var ID = $scope.getCurWheelchairPart().partID
          if($scope.getCurWheelchairPart().partID){
            $scope.curEditWheelchair.setColorForPart(2000, newColorID);
          }
          console.log('Changed color option');
        }
      };

      $scope.setCurOptionSize = function (newSizeIndex) {
        if ($scope.getCurPanelID() === $scope.getCurWheelchairPart().optionID) {
          $scope.curEditWheelchair.setSizeForPart($scope.getCurWheelchairPart().partID, newSizeIndex);
          console.log('Changed size option');
        }
      };

      /*****************Panels*********************/

      $scope.curOption = $scope.getCurPartData().getDefaultOption();

      //Indicates the current panel
      //ID = -1 indicates no panel open
      var curPanel = -1;

      //Sets curPanel to the chosen panel
      //Closes the panel if id and type match curPanel
      $scope.setPanel = function (id) {
          if ($scope.isPanelSelected(id)) {
            curPanel = -1;
            console.log('I am true')
            $scope.curOption = $scope.getCurPartData().getDefaultOption();
          }
          else {
            curPanel = id;
            var partID = $scope.getCurPage().partID;
            var part = $scope.curFrameData.getPart(partID);
            $scope.curOption = part.getOption(id);
          }
          //console.log("set");
      };

      //Closes any open panel
      $scope.closeAllPanels = function () {
        $scope.setPanel(-1);
        $scope.curOption = $scope.getCurPartData().getDefaultOption();
        $scope.closeSaveDropDown();
      };

      //Check if the panel with the given id and type is selected
      $scope.isPanelSelected = function (id) {
        return (curPanel === id);
      };


      $scope.panelReset = function(){
        curPanel=-1;
        $scope.curOption = $scope.getCurPartData().getDefaultOption();
      };

      $scope.getCurPanelID = function () {
        return curPanel;
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
        var wPart = $scope.curEditWheelchair.getPart(partID);

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
        var wPart = $scope.curEditWheelchair.getPart(partID);
        return option.getColor(wPart.colorID).getHexString();
      };

      /*******************Saving***********************/

        //Saves the current design and updates the database if the user is logged in
      $scope.saveDesign = function () {
        if(1) {  //TODO  replace 1 with highlightUnfilledArrows()
          User.pushNewWheelchair();
          $location.path('/cart');
        }

      };

      $scope.saveComputer = function () {
        $scope.saveDropdown = false;
        User.saveComputer();
      };

      /*******************Sharing***********************/

      // Creates a design from the current wheelchair configuration and saves it in the DB (must be logged in)
      //
      function generateDesignIDForCurrentChair() {
        var design = User.getCurEditWheelchairDesign();

        if (_.isNull(design)) {
          design = new Design({
            'creator': User.getID(),
            'wheelchair': $scope.curEditWheelchair
          });
        }

        design.wheelchair = $scope.curEditWheelchair;

        // If the design doesn't have an ID, generate one by saving it to the backend
        var designPromise = design.hasID() ? User.updateDesign(design) : User.saveDesign(design);

        return designPromise;
      }

      $scope.shareDesignID = function () {
        generateDesignIDForCurrentChair()
        .then(function (design) {
          $scope.modalDesign = design;
          User.createCurrentDesign(design);
          return ngDialog.open({
            'template': 'views/modals/designIDModal.html',
            'scope': $scope
          })
          .closePromise;
        })
        .then(function () {
          $scope.modalDesign = null;
        })
        .catch(function (err) {
          if (err instanceof Errors.NotLoggedInError) {
            ngDialog.open({
              'template': 'views/modals/loginPromptModal.html'
            });
          }
        });
      };

      /*********************Saving For Later*********************/

      // save the current wheelchair to the wishlist and make sure its not the currently editing wheelchair anymore
      $scope.saveForLater = function () {
        if (!User.isLoggedIn()) {
          $scope.loginPanel = loginPanelStatus.LOGIN;
        }
        else {
          var design = User.getCurEditWheelchairDesign();

          if (_.isNull(design)) {
            design = new Design({
              'creator': User.getID(),
              'wheelchair': $scope.curEditWheelchair
            });
          }

          design.wheelchair = $scope.curEditWheelchair;

          var designPromise = null;
          if (design.hasID()) {
            // prompt if they want to create a copy or overwrite
            designPromise = ngDialog.open({
              'template': 'views/modals/saveDesignMethodModal.html',
              'scope': $scope
            })
            .closePromise
            .then(function (saveMethod) {
              // can either choose to create a copy, or overwrite the existing design in the DB
              switch (saveMethod.value) {
                case 'copy': {
                  delete design.id; // remove the id
                  design.creator = User.getID();
                  return User.saveDesign(design);
                }
                case 'overwrite': {
                  if (User.getID() === design.creator || User.isAdmin()) {
                    return User.updateDesign(design);
                  } else {
                    return ngDialog.open({
                      'template': '<div><h2>Sorry, you can\'t overwrite this design</h2></div>',
                      'plain': true
                    })
                    .closePromise
                    .then(_.constant(null));
                  }
                  break;
                }
                default: {
                  throw new Error("Invalid saveMethod: " + saveMethod);
                }
              }
            });
          } else {
            // just go ahead and save the design to the DB, its new anyways
            designPromise = User.saveDesign(design);
          }

          if (designPromise) {
            designPromise
            .then(function (design) {
              if (design instanceof Design) {
                User.addDesignIDToSavedChairs(design.id);
              }
            })
            .catch(function (design) {
              ngDialog.open({
                'template': '<div><h2>Oops! An Error Occurred</h2></div>',
                'plain': true
              });
            });
          }
        }
      };

      /*****************General Use Functions*********************/

        //Trims a string with an ellipsis if it is longer than len
      $scope.ellipsisFormat = function (str, len) {
        if (str.length > len) {
          return str.substring(0, len) + '...';
        }
        else {
          return str;
        }
      };

      //returns the full string for the title, but only if necessary   ( similar to ellipsisFormat() )
      $scope.titleForEllipsis = function (str, len) {
        if (str.length > len) {
          return str;
        }
        else {
          return '';
        }
      };

      angular.element($(window)).bind('resize', function() {
        $scope.$apply();
      });

      $scope.screenWideQuery = function(){
        var width = $(window).width();
        var height = $(window). height();
        return 0.463*(width-330) > 0.9*(height-140);
      };

      $scope.nothing = function(){
        return
      }
      $scope.measureChanged = function(){
        measureChanged();
        calcCompleteness();
      }
      $scope.$on('$viewContentLoaded', function() {
          initNavBar();
      });




    /*********** canvas function*********/



    }]);
