

var span = document.getElementById("nav_span");
span.style.visibility = "hidden";
var margin = 4;
var ARROW_WIDTH = 90;
var customArrows = new Array();
var measureArrows = new Array();
var arrows = null;
var myScope;
var arrowFocus = null;
var focusedIndex = 0;
var mBtn;
var cBtn;
var pageType = "CUSTOMIZE";
var tweenSpeed = 800;
var tweenType = createjs.Ease.getElasticInOut(2, 5);
var arrowWidth = 70;
var lastCustomArrow;
var lastMeasureArrow;
var done_txt;
var spanShift = 150;

//Arrow Object, Handles all arrow eventHandlers and graphic changes.
var Arrow = function(frame, name, index, page, custom){
	this.complete = false;
	this.page = page;
	this.index = index;
	this.name = name;
	this.custom = custom;
	this.mc = new lib.Arrow();
	stage.addChild(this.mc);
	if(custom){
		this.mc.x = customArrows.length*(arrowWidth+margin)+155;
	}else{
		this.mc.x = 950;
	}
	this.mc.y = 1;
	this.frame = frame;
	var mc = this.mc;
	mc.addEventListener("click", highlightArrow);
	mc.addEventListener("mouseover", hover_on);
	mc.addEventListener("rollout", hover_off);
	
	var frame = this.frame;
	var me = this;
	gotoAndStop(frame);
	function highlightArrow(){

		if(custom){
			lastCustomArrow = me;
		}else{
			lastMeasureArrow = me;
		}
		focusedIndex= index;
		
		myScope.pageSwitchJump(page);
		me.complete = true;
		calcCompleteness();

		if(custom && arrowFocus){
			arrowFocus.gotoAndStop(1);
		}
		if(!custom){
			if(arrowFocus.page.visitstatus==="visited"){
				arrowFocus.gotoAndStop(1);
			}else{
				arrowFocus.gotoAndStop(2);
			}
		}
		arrowFocus = me;

		frame = 3;
		mc.gotoAndStop(frame);
		
	}
	this.highlightArrow = highlightArrow;
	function hover_on(m){

		span.style.visibility = "visible";
		if(frame === 4){
			mc.gotoAndStop(5);
		}
		span.innerHTML = name;
		span.style.left = spanShift+index*(ARROW_WIDTH-15)+"px";
	}
	function hover_off(m){
		mc.gotoAndStop(frame);
		span.style.visibility = "hidden";
	}

	function gotoAndStop(integer){
		frame = integer;
		mc.gotoAndStop(integer);
	}
	this.gotoAndStop = gotoAndStop;

	function flash(){
		mc.flasher.gotoAndPlay(1);
	}
	this.flash = flash;
}

//Initializes all the DOM Elements/MovieClips 
function initStuff(container){
	done_txt = container.done;
	myScope = angular.element(document.getElementById("NavigationBar")).scope();
	initArrows();
	mBtn = container.mBtn;
	cBtn = new lib.cBtn;
	stage.addChild(cBtn);
	cBtn.x = -20;
	cBtn.y = 1;
	mBtn = new lib.mBtn;
	stage.addChild(mBtn);
	mBtn.x = 895;
	mBtn.addEventListener("click", switchToMeasurement);
	cBtn.addEventListener("click", switchToCustomize);
	document.getElementById("NavigationBar").addEventListener("mousemove", changeCursorPointer);
	document.getElementById("NavigationBar").addEventListener("mouseout", changeCursorDefault);
	fixFirefox();
}

function initArrows(){
	var customizePages = myScope.getCustomizePages();
	var measurementPages = myScope.getMeasurePages();
	//Initialize customPages
	for(var i=0; i<customizePages.length; i++){
		if(i===0){
			var arrow = new Arrow(3, myScope.getProgressBarSegmentTooltipText(customizePages[i]), i, customizePages[i], true);
			arrowFocus = arrow;
			customArrows.push(arrow);	
		}else{
			var arrow = new Arrow(2, myScope.getProgressBarSegmentTooltipText(customizePages[i]), i,  customizePages[i], true);
			customArrows.push(arrow);	
		}
	}

	//Initialize measurementPages
	for(var i=0; i<measurementPages.length; i++){
		if(i===0){
			var arrow = new Arrow(3, "Rear Seat Width", i, measurementPages[i], false);
			measureArrows.push(arrow);	
		}else{
			var arrow = new Arrow(2, myScope.getMeasurementTooltipText(measurementPages[i]), i,  measurementPages[i], false);
			measureArrows.push(arrow);	
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
	spanShift = 320;
	if(pageType === "CUSTOMIZE"){
		for(var i=0; i<customArrows.length; i++){
			createjs.Tween.get(customArrows[i].mc)
			.to({
				x: 50,
			}, tweenSpeed, tweenType);
		}

		for(var i=0; i<measureArrows.length; i++){
			createjs.Tween.get(measureArrows[i].mc)
			.to({
				x: 325+i*(arrowWidth+margin),
			}, tweenSpeed, tweenType);
		}

		createjs.Tween.get(mBtn)
		.to({
			x: mBtn.x-740,
		}, tweenSpeed, tweenType);
		pageType = "MEASUREMENT";
	}
	arrowFocus = measureArrows[0];
	myScope.setCurPageType(myScope.pageType.MEASURE);
	myScope.setCurPage(0);
	lastMeasureArrow.highlightArrow();
	arrows = measureArrows;
}

function switchToCustomize(m){
	spanShift = 150;
	if(pageType === "MEASUREMENT"){
		for(var i=0; i<customArrows.length; i++){
			createjs.Tween.get(customArrows[i].mc)
			.to({
				x: i*(arrowWidth+margin)+155,
			}, tweenSpeed, tweenType);
		}

		for(var i=0; i<measureArrows.length; i++){
			createjs.Tween.get(measureArrows[i].mc)
			.to({
				x: 950,
			}, tweenSpeed, tweenType);
		}

		createjs.Tween.get(mBtn)
		.to({
			x: 895,
		}, tweenSpeed, tweenType);
		pageType = "CUSTOMIZE";
	}
	myScope.setCurPageType(myScope.pageType.CUSTOMIZE);
	myScope.setCurPage(0);
	lastCustomArrow.highlightArrow();
	arrows = customArrows;
}



function navigateArrows(dir){
	focusedIndex+=dir;
	if( focusedIndex=== arrows.length ){
		switchToMeasurement(null);
		focusedIndex = 0;
	}
	if(focusedIndex === -1){
		switchToCustomize(null);
		focusedIndex=customArrows.length-1;
	}
	arrows[focusedIndex].highlightArrow();
}



function calcCompleteness(){
	var numArrows = measureArrows.length+customArrows.length;
	var numComplete = 0;
	for(var i=0; i<measureArrows.length; i++){
		if(measureArrows[i].complete){
			numComplete++;
		}
	}
	for(var i=0; i<customArrows.length; i++){
		if(customArrows[i].complete){
			numComplete++;
		}
	}
	done_txt.text = Math.round(numComplete/numArrows*100)+"%";
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
			arrows[unFinPages[0].index].highlightArrow();
		}
		measureArrows[unFinPages[i].index].flash();
	}
	return unFinPages.length === 0;
}

