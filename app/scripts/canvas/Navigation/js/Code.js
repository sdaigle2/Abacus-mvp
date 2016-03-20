var margin = 0;       				  // Margin Between Arrows
var customArrows = new Array();		  
var measureArrows = new Array();
var arrows = null;	//This alternates between custom and measure arrows array.
var myScope;
var arrowFocus = null;

var mBtn;
var cBtn;

var tweenSpeed = 800;
var tweenType = createjs.Ease.getElasticInOut(2, 5);
var mArrowWidth = 100; 
var cArrowWidth = 100;  

var done_txt;          //complete percentage
var canvasWidth = 2560;
var ratio = $(window).width() /canvasWidth;
var percentSpace = 120;
var minRatio = 1180 / canvasWidth;

//--I believe the scope has these properties, so handling them here is redundant.--/
var lastCustomArrow;  //TODO OBSO
var lastMeasureArrow; //TODO OBSO
var pageType = "CUSTOMIZE"; //TODO OBSO
var focusedIndex = 0;   //TODO OBSOLETE


if($(window).width() > 1185) {
  var ARROW_WIDTH = 90 * ratio;                           // "Arrows WIDTH"
  var spanShift = 150 * ratio;
  var measureShift = 320 * ratio;
  var customizeShift = 150 * ratio;
} else {
  var ARROW_WIDTH = 90 * minRatio;                           // "Arrows WIDTH"
  var spanShift = 150 * minRatio;
  var measureShift = 320 * minRatio;
  var customizeShift = 150 * minRatio;
}

//Arrow Object, Handles all arrow eventHandlers and graphic changes.
// Image : The image of the arrow
// Name : The name of the Arrow
// Page : The page
// Custom : Is it custom or Measure

window.onresize = function(event) {
  if($(window).width() > 1185){
  ratio = $(window).width() * 0.9 /canvasWidth;
  ARROW_WIDTH = 90 * ratio;                           // "Arrows WIDTH"
  spanShift = 150 * ratio;
  measureShift = 320 * ratio;
  customizeShift = 150 *ratio;}
}

//Initializes all the DOM Elements/MovieClips
function initStuff(container){
	done_txt = container.done;
    myScope = angular.element(document.getElementById("NavigationBar")).scope();
    done_txt.text = myScope.completePercentage()+"%";
	cBtn = new lib.cBtn;
	stage.addChild(cBtn);
	cBtn.y = 1;
	mBtn = new lib.mBtn;
	stage.addChild(mBtn);
	mBtn.x = canvasWidth - mBtn.nominalBounds.width - percentSpace;
	mBtn.addEventListener("click", switchToMeasurement);
	cBtn.addEventListener("click", switchToCustomize);
	document.getElementById("NavigationBar").addEventListener("mousemove", changeCursorPointer);
	document.getElementById("NavigationBar").addEventListener("mouseout", changeCursorDefault);
    initArrows();
	fixFirefox();
	customChanged();
	measureChanged();
	stage.setChildIndex( cBtn, stage.getNumChildren()-1);
	stage.setChildIndex( mBtn, stage.getNumChildren()-1);
  }

function initArrows(){
  var customizePages = myScope.getCustomizePages();
  var measurementPages = myScope.getMeasurePages();

  var fillSpace = mBtn.x - cBtn.nominalBounds.width;
  cArrowWidth = fillSpace/(customizePages.length);
  mArrowWidth = fillSpace/measurementPages.length;
	//Initialize customPages
	for(var i=0; i<customizePages.length; i++){
	    var arrowX = (cBtn.nominalBounds.width-10) + i*(cArrowWidth+margin);
		if(i===0){
			var arrow = new Arrow(3, myScope.getProgressBarSegmentTooltipText(customizePages[i]),  customizePages[i], arrowX,cArrowWidth, true);
			arrowFocus = arrow;
			customArrows.push(arrow);
		}else{
     		var optionIndexC = myScope.curEditWheelchair.getOptionIDForPart(customizePages[i].partID);
      		if (optionIndexC !== -1){
        		var arrow = new Arrow(1, myScope.getProgressBarSegmentTooltipText(customizePages[i]),  customizePages[i],arrowX, cArrowWidth, true);
        		customArrows.push(arrow);
   		    }else {
		        var arrow = new Arrow(2, myScope.getProgressBarSegmentTooltipText(customizePages[i]), customizePages[i],arrowX, cArrowWidth, true);
		        customArrows.push(arrow);
		    }
		}
	}

	//Initialize measurementPages
	for(var i=0; i<measurementPages.length; i++){
    var arrowX = mBtn.x+25;
		if(i===0){
			var arrow = new Arrow(3, "Rear Seat Width",  measurementPages[i],arrowX,mArrowWidth, false);
			measureArrows.push(arrow);
		}else{
      var optionIndexM = myScope.curEditWheelchair.getOptionIndexForMeasure(measurementPages[i].measureID);
      if(optionIndexM !== -1){
        var arrow = new Arrow(1, myScope.getMeasurementTooltipText(measurementPages[i]), measurementPages[i],arrowX,mArrowWidth, false);
        measureArrows.push(arrow);
      } else {
        var arrow = new Arrow(2, myScope.getMeasurementTooltipText(measurementPages[i]), measurementPages[i],arrowX,mArrowWidth, false);
        measureArrows.push(arrow);
      }
		}
	}
	arrows = customArrows;
	lastCustomArrow = customArrows[0];
	lastMeasureArrow = measureArrows[0];
}



function changeCursorPointer(m){
	document.body.style.cursor = "pointer";
}


function changeCursorDefault(m){
	document.body.style.cursor = "default";
}

function switchToMeasurement(m){
	spanShift = measureShift;
	if(pageType === "CUSTOMIZE"){
		for(var i=0; i<customArrows.length; i++){
			createjs.Tween.get(customArrows[i].mc)
			.to({
				x: 50
			}, tweenSpeed, tweenType);
		}

		for(var i=0; i<measureArrows.length; i++){
			createjs.Tween.get(measureArrows[i].mc)
			.to({
				x: 680+i*(mArrowWidth+margin)
			}, tweenSpeed, tweenType);
		}

		createjs.Tween.get(mBtn)
		.to({
			x: cBtn.x+cBtn.nominalBounds.width-35
		}, tweenSpeed, tweenType);
		pageType = "MEASUREMENT";
	}
	arrowFocus = measureArrows[0];
	myScope.setCurPageType(myScope.pageType.MEASURE);
	lastMeasureArrow.pressed();
	arrows = measureArrows;
}

function switchToCustomize(m){
	spanShift = customizeShift;
	if(pageType === "MEASUREMENT"){
		for(var i=0; i<customArrows.length; i++){
			createjs.Tween.get(customArrows[i].mc)
			.to({
				x: i*(cArrowWidth+margin)+cBtn.nominalBounds.width
			}, tweenSpeed, tweenType);
		}

		for(var i=0; i<measureArrows.length; i++){
			createjs.Tween.get(measureArrows[i].mc)
			.to({
				x: canvasWidth - 350
			}, tweenSpeed, tweenType);
		}

		createjs.Tween.get(mBtn)
		.to({
			x: canvasWidth - mBtn.nominalBounds.width - percentSpace
		}, tweenSpeed, tweenType);
		pageType = "CUSTOMIZE";
	}
	myScope.setCurPageType(myScope.pageType.CUSTOMIZE);
	lastCustomArrow.pressed();
	arrows = customArrows;
}



function navigateArrows(dir){
	focusedIndex += dir;
	if( focusedIndex === arrows.length ){
		switchToMeasurement(null);
		focusedIndex = 0;
	}
	if(focusedIndex === -1){
		switchToCustomize(null);
		focusedIndex=customArrows.length-1;
	}
	arrows[focusedIndex].pressed();
}



function calcCompleteness(){
	done_txt.text = myScope.completePercentage()+"%";
}




function fixFirefox(){
	var canvy = document.getElementById("NavigationBar");
	var ctx = canvy.getContext("2d");
	ctx.textBaseline = "alphabetic";
}


function highlightUnfilledArrows(){
	switchToMeasurement();
	var unFinPages = myScope.completedCheck();
	for(var i=0; i<unFinPages.length; i++){
		if(i===0){
			arrows[unFinPages[0].index].pressed();
		}
		measureArrows[unFinPages[i].index].flash();
	}
	return unFinPages.length === 0;
}


function measureChanged(){
	var unFinPages = myScope.completed();
	if(!unFinPages){
		mBtn.gotoAndStop(1);
	}
}

function customChanged(){
	var unFinPages = myScope.completedC();
	if(!unFinPages){
		cBtn.gotoAndStop(1);
	}


}
