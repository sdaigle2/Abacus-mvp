(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 1000,
	height: 29,
	fps: 24,
	color: "#FFFFFF",
	manifest: []
};



// symbols:



(lib.Arrow = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(5));

	// Layer 5 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_3 = new cjs.Graphics().p("An1CRIAGgPIDgiAIj5iSIMkAAIDtCMIgDAPIjqCGg");
	var mask_graphics_4 = new cjs.Graphics().p("An1CRIAGgPIDgiAIj5iSIMkAAIDtCMIgDAPIjqCGg");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:null,x:0,y:0}).wait(3).to({graphics:mask_graphics_3,x:52.1,y:14.5}).wait(1).to({graphics:mask_graphics_4,x:52.1,y:14.5}).wait(1));

	// Layer 4
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#00A99A").ss(1.5,1,1).p("AgIkTIlLInAAokTIlJInAg6kTIlLInAiekTIlLInAhskTIlLInAEikTIlJInAFUkTIlLInAG4kTIlLInAGGkTIlLInAC+kTIlJInADwkTIlJInACMkTIlJInABakTIlJInAKykTIlLInAJOkTIlLInAKAkTIlLInAIckTIlLInAHqkTIlLInAlmkTIlLInAk0kTIlLInAkCkTIlLInAjQkTIlLIn");
	this.shape.setTransform(52.6,11.9);
	this.shape._off = true;

	this.shape.mask = mask;

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(3).to({_off:false},0).to({_off:true},1).wait(1));

	// Layer 1
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#00A99A").ss(0.1,1,1).p("AoOiQID5CSIj5CPIMkAAID5iPIj5iSg");
	this.shape_1.setTransform(52.8,14.5);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#00A99A").s().p("AoOCRID5iPIj5iSIMkAAID5CSIj5CPg");
	this.shape_2.setTransform(52.8,14.5);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f().s("#7EC9C2").ss(1.5,1,1).p("AoOiQID5CSIj5CPIMkAAID5iPIj5iSg");
	this.shape_3.setTransform(52.8,14.5);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#7EC9C2").s().p("AoOCRID5iPIj5iSIMkAAID5CSIj5CPg");
	this.shape_4.setTransform(52.8,14.5);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f().s("#00A99A").ss(1.5,1,1).p("AoOiQID5CSIj5CPIMkAAID5iPIj5iSg");
	this.shape_5.setTransform(52.8,14.5);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#FAF7F7").s().p("AoOCRID5iPIj5iSIMkAAID5CSIj5CPg");
	this.shape_6.setTransform(52.8,14.5);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f().s("#00A99A").ss(1.5,1,1).p("AH/ALIAQgJIgNgGgAICgEIjsiMIskAAID5CSIjgCBIgNAHIgMAHIASAAIMSAAIDpiGAn1CDIgHAOAoCCKIgBAE");
	this.shape_7.setTransform(52.8,14.5);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#FAF7F7").s().p("AgLAHIALgHIAMgGIgGANgAAAAEIAAgEg");
	this.shape_8.setTransform(1.3,28.3);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#D1D4D4").s().p("An1CRIAGgPIDgiAIj5iSIMkAAIDtCMIgDAPIjqCGg");
	this.shape_9.setTransform(52.1,14.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1}]}).to({state:[{t:this.shape_4},{t:this.shape_3}]},1).to({state:[{t:this.shape_6},{t:this.shape_5}]},1).to({state:[{t:this.shape_8},{t:this.shape_7}]},1).to({state:[{t:this.shape_9}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,107.5,31.1);


// stage content:



(lib.navBar = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		initStuff(this);
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#00A99A").s().p("Ai8C0IAAlmIF6AAIAAFmg");
	this.shape.setTransform(16,15);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(497,11.5,38,36);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, createjs, ss;