(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 1280,
	height: 31,
	fps: 60,
	color: "#FFFFFF",
	manifest: []
};



// symbols:



(lib.redArrow = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#D52327").s().p("AmnCVIAHgOIDgiFIj5iXIKMAAIDnCOIAAAUIjnCIg");
	this.shape.setTransform(44.3,15);

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,88.6,30);


(lib.mBtn = function() {
	this.initialize();

	// Layer 1
	this.text = new cjs.Text("Measurments", "15px 'Gotham'", "#88CBC3");
	this.text.textAlign = "center";
	this.text.lineHeight = 17;
	this.text.lineWidth = 101;
	this.text.setTransform(79.8,7.6);

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#88CBC3").ss(2,1,1).p("AKhCRID5iPIj5iSI46AAID5CRIj5CQg");
	this.shape.setTransform(92.2,15.6);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#88CBC3").ss(1.5,1,1).p("AhBghIA8AgIg8AkAAGghIA8AgIg8Ak");
	this.shape_1.setTransform(152.3,16.2);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("AuZCRID6iQIj6iRIY5ABID6CRIj6CPgAJfAoIA9glIg8geIA8AegAIWAoIA9glIg8geIA8Aeg");
	this.shape_2.setTransform(92.2,15.6);

	this.addChild(this.shape_2,this.shape_1,this.shape,this.text);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-1,0,186.4,31.1);


(lib.cBtn = function() {
	this.initialize();

	// Layer 1
	this.text = new cjs.Text("Customize", "15px 'Gotham'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 17;
	this.text.lineWidth = 138;
	this.text.setTransform(69,4.5);

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#88CBC3").ss(2,1,1).p("AtbCRIW+AAID5iPIj5iSI2+AA");
	this.shape.setTransform(103.2,14.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#D2EDEA").ss(1.5,1,1).p("AAGgiIA8AhIg8AkAhBgiIA8AhIg8Ak");
	this.shape_1.setTransform(145.7,15.1);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#88CBC3").s().p("AtbCRIAAkhIW+AAID5CSIj5CPgAGvAoIA8glIg8gfIA8AfgAFlAoIA9glIg8gfIA8Afg");
	this.shape_2.setTransform(103.2,14.5);

	this.addChild(this.shape_2,this.shape_1,this.shape,this.text);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,-1,190.3,34);


(lib.Flasher = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(60));

	// Layer 1
	this.instance = new lib.redArrow();
	this.instance.setTransform(44.3,15,1,1,0,0,0,44.3,15);
	this.instance.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({alpha:1},0).wait(2).to({alpha:0.999},0).wait(2).to({alpha:0.998},0).wait(1).to({alpha:0.996},0).wait(1).to({alpha:0.995},0).wait(1).to({alpha:0.993},0).wait(1).to({alpha:0.99},0).wait(1).to({alpha:0.987},0).wait(1).to({alpha:0.984},0).wait(1).to({alpha:0.98},0).wait(1).to({alpha:0.976},0).wait(1).to({alpha:0.971},0).wait(1).to({alpha:0.965},0).wait(1).to({alpha:0.959},0).wait(1).to({alpha:0.952},0).wait(1).to({alpha:0.944},0).wait(1).to({alpha:0.935},0).wait(1).to({alpha:0.925},0).wait(1).to({alpha:0.915},0).wait(1).to({alpha:0.902},0).wait(1).to({alpha:0.889},0).wait(1).to({alpha:0.873},0).wait(1).to({alpha:0.856},0).wait(1).to({alpha:0.836},0).wait(1).to({alpha:0.813},0).wait(1).to({alpha:0.787},0).wait(1).to({alpha:0.756},0).wait(1).to({alpha:0.72},0).wait(1).to({alpha:0.677},0).wait(1).to({alpha:0.624},0).wait(1).to({alpha:0.56},0).wait(1).to({alpha:0.485},0).wait(1).to({alpha:0.406},0).wait(1).to({alpha:0.334},0).wait(1).to({alpha:0.275},0).wait(1).to({alpha:0.228},0).wait(1).to({alpha:0.19},0).wait(1).to({alpha:0.159},0).wait(1).to({alpha:0.133},0).wait(1).to({alpha:0.112},0).wait(1).to({alpha:0.093},0).wait(1).to({alpha:0.078},0).wait(1).to({alpha:0.065},0).wait(1).to({alpha:0.053},0).wait(1).to({alpha:0.044},0).wait(1).to({alpha:0.035},0).wait(1).to({alpha:0.028},0).wait(1).to({alpha:0.022},0).wait(1).to({alpha:0.017},0).wait(1).to({alpha:0.012},0).wait(1).to({alpha:0.009},0).wait(1).to({alpha:0.006},0).wait(1).to({alpha:0.004},0).wait(1).to({alpha:0.002},0).wait(1).to({alpha:0.001},0).wait(1).to({alpha:0},0).wait(2));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,88.6,30);


(lib.Arrow = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(6));

	// Layer 3
	this.flasher = new lib.Flasher();
	this.flasher.setTransform(42.3,14.5,1,1,0,0,0,44.3,15);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#D1D4D4").s().p("AgBgJIADADIgCAPIgBABg");
	this.shape.setTransform(102,14.8);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.flasher}]}).wait(6));

	// Layer 5 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_3 = new cjs.Graphics().p("AmlCRIAHgPIDgiAIj5iSIKDAAIDsCMIgDAPIjpCGg");
	var mask_graphics_4 = new cjs.Graphics().p("An1CRIAGgPIDgiAIj5iSIKNAAIDnCJIAAATIjnCFgAIDgHIAGADIgDAPIgDABg");
	var mask_graphics_5 = new cjs.Graphics().p("AmnCRIAHgPIDgiAIj5iSIKHAAIDsCMIgDAPIjpCGg");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:null,x:0,y:0}).wait(3).to({graphics:mask_graphics_3,x:44.1,y:14.5}).wait(1).to({graphics:mask_graphics_4,x:52.1,y:14.5}).wait(1).to({graphics:mask_graphics_5,x:44.3,y:14.5}).wait(1));

	// Layer 4
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#88CBC3").ss(1.5,1,1).p("AHqkTIlLInAIckTIlLInAKAkTIlLInAJOkTIlLInAKykTIlLInABakTIlJInACMkTIlJInADwkTIlJInAC+kTIlJInAGGkTIlLInAG4kTIlLInAFUkTIlLInAEikTIlJInAhskTIlLInAiekTIlLInAg6kTIlLInAAokTIlJInAgIkTIlLInAjQkTIlLInAkCkTIlLInAk0kTIlLInAlmkTIlLIn");
	this.shape_1.setTransform(52.6,11.9);
	this.shape_1._off = true;

	this.shape_1.mask = mask;

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(3).to({_off:false},0).to({_off:true},1).wait(2));

	// Layer 1
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#88CBC3").ss(0.1,1,1).p("Am5iQID5CSIj5CPIJ6AAID5iPIj5iSg");
	this.shape_2.setTransform(44.3,14.5);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#88CBC3").s().p("Am5CRID5iPIj5iSIJ6AAID5CSIj5CPg");
	this.shape_3.setTransform(44.3,14.5);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("#7EC9C2").ss(1.5,1,1).p("Am2iQID5CSIj5CPIJ0AAID5iPIj5iSg");
	this.shape_4.setTransform(43.9,14.5);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#7EC9C2").s().p("Am2CRID6iPIj6iSIJ0AAID5CSIj5CPg");
	this.shape_5.setTransform(43.9,14.5);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f().s("#88CBC3").ss(1.5,1,1).p("Am3iQID5CSIj5CPIJ2AAID5iPIj5iSg");
	this.shape_6.setTransform(44.1,14.5);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FAF7F7").s().p("Am3CRID5iPIj5iSIJ2AAID5CSIj5CPg");
	this.shape_7.setTransform(44.1,14.5);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f().s("#88CBC3").ss(1.5,1,1).p("AGsgEIgDAPIAPgJIgMgGIjtiMIp2AAID5CSIjgCBIgNAHIgMAHIATAAIJjAAIDqiGAmeCDIgGAOAmrCKIgBAE");
	this.shape_8.setTransform(44.1,14.5);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#000000").s().p("AgLAHIALgHIAMgGIgGANgAAAAEIAAgEg");
	this.shape_9.setTransform(1.3,28.3);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#D1D4D4").s().p("An1CRIAGgPIDgiAIj5iSIKNAAIDnCJIAAATIjnCFgAIDgHIAGADIgDAPIgDABg");
	this.shape_10.setTransform(52.1,14.5);

	this.shape_11 = new cjs.Shape();
	this.shape_11.graphics.f("#ECECEC").s().p("AmnCRIAHgPIDgiAIj5iSIKHAAIDsCMIgDAPIjpCGg");
	this.shape_11.setTransform(44.3,14.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2}]}).to({state:[{t:this.shape_5},{t:this.shape_4}]},1).to({state:[{t:this.shape_7},{t:this.shape_6}]},1).to({state:[{t:this.shape_9},{t:this.shape_8}]},1).to({state:[{t:this.shape_10}]},1).to({state:[{t:this.shape_11}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2,-1,104.3,31.1);


// stage content:



(lib.navBar = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		stage.enableMouseOver(20);
		initStuff(this);
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// Layer 1
	this.done = new cjs.Text("0%", "17px 'Gotham'", "#88CBC3");
	this.done.name = "done";
	this.done.textAlign = "center";
	this.done.lineHeight = 19;
	this.done.lineWidth = 100;
	this.done.setTransform(1256.9,6.4);

	this.timeline.addTween(cjs.Tween.get(this.done).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(1846.9,21.9,104,22.5);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, createjs, ss;