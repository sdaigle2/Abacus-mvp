var span = document.getElementById("nav_span");
span.style.visibility = "hidden";
var margin = 4;
var ARROW_WIDTH = 90;
var arrows = new Array();
var myScope;
var arrowFocus = null;
var focusedIndex = 0;
var Arrow = function(frame, name, index, page){
	this.page = page;
	this.index = index;
	this.name = name;
	this.mc = new lib.Arrow();
	stage.addChild(this.mc);
	this.mc.x = arrows.length*(85+margin);
	this.frame = frame;
	var mc = this.mc;
	mc.addEventListener("click", highlightArrow);
	mc.addEventListener("mouseover", hover_on);
	mc.addEventListener("rollout", hover_off);
	
	var frame = this.frame;
	var me = this;
	gotoAndStop(frame);
	function highlightArrow(){
		if(arrowFocus){
			arrowFocus.gotoAndStop(1);
		}
		arrowFocus = me;
		focusedIndex= index;
		frame = 0;
		mc.gotoAndStop(frame);
		myScope.pageSwitchJump(page);
	}
	this.highlightArrow = highlightArrow;
	function hover_on(m){

		span.style.visibility = "visible";
		if(frame === 4){
			mc.gotoAndStop(5);
		}
		span.innerHTML = name;
		span.style.left = index*ARROW_WIDTH+"px";
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
}

function initArrows(){
	var pages = myScope.getCurPages();
	for(var i=0; i<pages.length; i++){
		//console.log(mySCope..pageSwitchJump(pages[i]))
		if(i===0){
			var arrow = new Arrow(0, myScope.getProgressBarSegmentTooltipText(pages[i]), i, pages[i]);
			arrowFocus = arrow;
			arrows.push(arrow);	
		}else{
			var arrow = new Arrow(4, myScope.getProgressBarSegmentTooltipText(pages[i]), i,  pages[i]);
			arrows.push(arrow);	
		}
	}
}

function initStuff(container){
	myScope = angular.element(document.getElementById("NavigationBar")).scope();
	console.log(myScope);
	initArrows();
	document.getElementById("NavigationBar").addEventListener("mousemove", changeCursorPointer);
	document.getElementById("NavigationBar").addEventListener("mouseout", changeCursorDefault);
}

function changeCursorPointer(m){
	document.body.style.cursor = "pointer";

}


function changeCursorDefault(m){
	document.body.style.cursor = "default";
}

function switchToMeasurement(){
	console.log("switching to measurement");
	deleteAllArrows();
	arrows = new Array();
	initArrows();
}

function deleteAllArrows(){
	for(var i=0; i<arrows.length; i++){
		stage.removeChild(arrows[i].mc);
	}
}

function navigateArrows(dir){
	focusedIndex+=dir;
	console.log(focusedIndex);
	console.log(arrows[focusedIndex]);
	arrows[focusedIndex].highlightArrow();
}
//TODO: make pointer more presise
/*
var mouseX = m.offsetX;
var mouseY = m.offsetY;
var no_hover = true;
console.log("mouseMoved{x: "+mouseX+","+mouseY+"}");
for(var i=0; i<arrows.length; i++){
	if(arrows[i].mc.hitTest(mouseX,mouseY)){
		//change pointer to pointer
		document.body.style.cursor = "pointer";
		no_hover= false;
	}
}
//console.log(no_hover);
if(no_hover){
	//change pointer to normal
	document.body.style.cursor = "default";
}*/