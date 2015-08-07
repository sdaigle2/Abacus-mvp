

var margin = 4;
var arrows = new Array();
var myScope;
var Arrow = function(){
	this.mc = new lib.Arrow();
	stage.addChild(this.mc);
	this.mc.x = arrows.length*(85+margin);
	this.frame = 0;
	this.mc.addEventListener("click",incrementFrame);
	var mc = this.mc;
	var frame = this.frame;
	function incrementFrame(){
		frame++;
		mc.gotoAndStop(frame);
	}
	function gotoAndStop(integer){
		mc.gotoAndStop(integer);
	}
	this.gotoAndStop = gotoAndStop;
}

function initStuff(container){
	myScope = angular.element(document.getElementById("NavigationBar")).scope();
	var numArrows = myScope.getCurPages().length;
	for(var i=0; i<numArrows; i++){
		var arrow = new Arrow();
		arrows.push(arrow);	
		if(i>0){
			arrow.gotoAndStop(4);
		}
	}
	document.getElementById("NavigationBar").addEventListener("mousemove", changeCursorPointer);
	document.getElementById("NavigationBar").addEventListener("mouseout", changeCursorDefault);
}

function changeCursorPointer(m){
	document.body.style.cursor = "pointer";

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
}


function changeCursorDefault(m){
	document.body.style.cursor = "default";

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
}

function affectMe(string){
	console.log(affectMe);
}