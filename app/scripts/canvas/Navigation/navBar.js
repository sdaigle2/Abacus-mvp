(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 2560,
	height: 62,
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


(lib.mBtn = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(2));

	// Layer 1
	this.text = new cjs.Text("Measurments  >>", "15px 'Gotham'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 17;
	this.text.lineWidth = 133;
	this.text.setTransform(188.9,12.1,2,2);

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#52A0F9").ss(2,1,1).p("AVCEjIHykeInykmMgx1gABIHyElInyEfg");
	this.shape.setTransform(184.4,30.1);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#52A0F9").ss(1.5,1,1).p("AANhEIB4BBIh5BJAiDhEIB4BBIh5BJ");
	this.shape_1.setTransform(304.7,31.3);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#52A0FB").s().p("A8zEiIHykeInykmMAx0AABIHzEmInzEegAS/BSIB4hMIh3g/IB3A/gAQtBSIB4hMIh3g/IB3A/g");
	this.shape_2.setTransform(184.4,30.1);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f().s("#00A89C").ss(2,1,1).p("AKhCRID5iPIj5iSI46AAID5CRIj5CQg");
	this.shape_3.setTransform(92.2,15.6);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("#FFFFFF").ss(1.5,1,1).p("AAGghIA8AgIg8AkAhBghIA8AgIg8Ak");
	this.shape_4.setTransform(152.3,16.2);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#00A89C").s().p("AuZCRID6iQIj6iRIY5ABID6CRIj6CPgAJfAoIA9glIg8geIA8AegAIWAoIA9glIg8geIA8Aeg");
	this.shape_5.setTransform(92.2,15.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape},{t:this.text,p:{scaleX:2,scaleY:2,x:188.9,y:12.1,text:"Measurments  >>",lineWidth:133}}]}).to({state:[{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.text,p:{scaleX:1,scaleY:1,x:79.8,y:7.6,text:"Measurments",lineWidth:101}}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,0,370.8,89.5);


(lib.cBtn = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// Layer 1
	this.text = new cjs.Text("Customize   >>", "15px 'Gotham'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 17;
	this.text.lineWidth = 117;
	this.text.setTransform(138.6,11,2,2);

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#52A0F9").ss(1.5,1,1).p("AiDhFIB4BBIh5BKAANhFIB4BBIh5BK");
	this.shape.setTransform(257.1,30.2);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#52A0F9").ss(2,1,1).p("A64EiMAt+AAAIHzkeInzklMgt+AAA");
	this.shape_1.setTransform(172.1,29.1);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#52A0FB").s().p("A64EiIAApDMAt+AAAIHyElInyEegANdBRIB5hLIh4g/IB4A/gALMBRIB4hLIh3g/IB3A/g");
	this.shape_2.setTransform(172.1,29.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape},{t:this.text}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,346.2,69);


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
	this.instance.setTransform(44.2,15,1,1,0,0,0,44.2,15);
	this.instance.alpha = 0;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({alpha:1},0).wait(1).to({regX:44.3,x:44.3},0).wait(1).to({alpha:0.999},0).wait(2).to({alpha:0.998},0).wait(1).to({alpha:0.996},0).wait(1).to({alpha:0.995},0).wait(1).to({alpha:0.993},0).wait(1).to({alpha:0.99},0).wait(1).to({alpha:0.987},0).wait(1).to({alpha:0.984},0).wait(1).to({alpha:0.98},0).wait(1).to({alpha:0.976},0).wait(1).to({alpha:0.971},0).wait(1).to({alpha:0.965},0).wait(1).to({alpha:0.959},0).wait(1).to({alpha:0.952},0).wait(1).to({alpha:0.944},0).wait(1).to({alpha:0.935},0).wait(1).to({alpha:0.925},0).wait(1).to({alpha:0.915},0).wait(1).to({alpha:0.902},0).wait(1).to({alpha:0.889},0).wait(1).to({alpha:0.873},0).wait(1).to({alpha:0.856},0).wait(1).to({alpha:0.836},0).wait(1).to({alpha:0.813},0).wait(1).to({alpha:0.787},0).wait(1).to({alpha:0.756},0).wait(1).to({alpha:0.72},0).wait(1).to({alpha:0.677},0).wait(1).to({alpha:0.624},0).wait(1).to({alpha:0.56},0).wait(1).to({alpha:0.485},0).wait(1).to({alpha:0.406},0).wait(1).to({alpha:0.334},0).wait(1).to({alpha:0.275},0).wait(1).to({alpha:0.228},0).wait(1).to({alpha:0.19},0).wait(1).to({alpha:0.159},0).wait(1).to({alpha:0.133},0).wait(1).to({alpha:0.112},0).wait(1).to({alpha:0.093},0).wait(1).to({alpha:0.078},0).wait(1).to({alpha:0.065},0).wait(1).to({alpha:0.053},0).wait(1).to({alpha:0.044},0).wait(1).to({alpha:0.035},0).wait(1).to({alpha:0.028},0).wait(1).to({alpha:0.022},0).wait(1).to({alpha:0.017},0).wait(1).to({alpha:0.012},0).wait(1).to({alpha:0.009},0).wait(1).to({alpha:0.006},0).wait(1).to({alpha:0.004},0).wait(1).to({alpha:0.002},0).wait(1).to({alpha:0.001},0).wait(1).to({alpha:0},0).wait(1).to({regX:44.2,x:44.2},0).wait(1));

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
	this.flasher.setTransform(86.4,29.5,2,2,0,0,0,44.2,15);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("#D1D4D4").s().p("AgBgJIADADIgCAPIgBABg");
	this.shape.setTransform(206,30,2,2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.flasher}]}).wait(6));

	// Layer 1
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#88CBC3").ss(0.1,1,1).p("At0khIHyElInyEeIT2AAIHzkeInzklg");
	this.shape_1.setTransform(90.5,29.6);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#88CBC3").s().p("At0EiIHzkeInzklIT3AAIHyElInyEeg");
	this.shape_2.setTransform(90.5,29.6);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f().s("#52A0FB").ss(1.5,1,1).p("AttkhIHyElInyEeITpAAIHykeInyklg");
	this.shape_3.setTransform(87.8,29.1);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#52A0FB").s().p("AttEiIHykeInyklITpAAIHxElInxEeg");
	this.shape_4.setTransform(87.8,29.1);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f().s("#C3D8F2").ss(1.5,1,1).p("AtwkhIHyElInyEeITvAAIHykeInyklg");
	this.shape_5.setTransform(88.2,29.1);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#C3D8F2").s().p("AtwEiIHykeInyklITvAAIHyElInyEeg");
	this.shape_6.setTransform(88.2,29.1);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f().s("#F2BC31").ss(1.5,1,1).p("ANYgJIgGAfIAfgSIgZgNInZkYIzvAAIHyElInAECIgMAcITJAAIHTkMAs+EGIgZAPIgCAHAtXEVIgZANIAmAA");
	this.shape_7.setTransform(88.1,29.1);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#F2BC31").s().p("As+EiIANgcIHAkCInyklITuAAIHZEYIgGAfInTEMgAs+EiIglAAIAYgNIAagPIgNAcgAtNEcIACgHg");
	this.shape_8.setTransform(86.9,29.1);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#D1D4D4").s().p("AvsEiIANgcIHAkCInyklIUbAAIHOESIAAAoInOEJgAQHgPIALAGIgGAfIgFADg");
	this.shape_9.setTransform(104.3,29.1);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#ECECEC").s().p("AtPEiIANgcIHAkCInyklIUQAAIHZEYIgGAfInTEMg");
	this.shape_10.setTransform(88.6,29.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1}]}).to({state:[{t:this.shape_4},{t:this.shape_3}]},1).to({state:[{t:this.shape_6},{t:this.shape_5}]},1).to({state:[{t:this.shape_8},{t:this.shape_7}]},1).to({state:[{t:this.shape_9}]},1).to({state:[{t:this.shape_10}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2,-0.5,208.5,60.1);


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
	this.done = new cjs.Text("0%", "34px 'Gotham'", "#88CBC3");
	this.done.name = "done";
	this.done.textAlign = "center";
	this.done.lineHeight = 36;
	this.done.lineWidth = 100;
	this.done.setTransform(2509.2,14);

	this.timeline.addTween(cjs.Tween.get(this.done).wait(1));

	// Layer 2
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#52A0F9").ss(1.5,1,1).p("EjH/gE1MGP/AAAIAAJrMmP/AAAg");
	this.shape.setTransform(1280,31);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("EjH/AE2IAAprMGP+AAAIAAJrg");
	this.shape_1.setTransform(1280,31);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(1279,30,2564.2,64);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, createjs, ss;