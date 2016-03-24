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


(lib.orange_tail = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#F2BC31").ss(1.5,1,1).p("AjCEGIgNAcIHEAAAjCEGIgaAPIgCAHAjcEVIgYANIAlAAAD1AIIm3D+AD1khInpAAIHpEh");
	this.shape.setTransform(24.5,29.1);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#F2BC31").s().p("AjPEiIAOgcIG1j9IAAEZgAj0EiIAZgNIgDAHIADgHIAagPIgOAcgAj0khIHoAAIAAEhg");
	this.shape_1.setTransform(24.5,29.1);

	this.addChild(this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-1,-1,51,60.1);


(lib.orange_head = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#F2BC31").ss(1.5,1,1).p("ADYgJIgGAfIAfgSIgZgNInIkPAjwEZIHCkD");
	this.shape.setTransform(24.1,28.1);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#F2BC31").s().p("AjjkYIHHEPIgGAfInBEDg");
	this.shape_1.setTransform(22.9,28.1);

	this.addChild(this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-1,-1,50.2,58.3);


(lib.orange_body = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#F2BC31").s().p("AmKEiIAAkZIAJgFIgJgEIAAkhIMFAAIAQAKIAAIwIgQAJg");
	this.shape.setTransform(39.5,29.1);

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,79,58.1);


(lib.mBtn = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(2));

	// Layer 1
	this.text = new cjs.Text("Measurements  >>", "15px 'Arial'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 17;
	this.text.lineWidth = 140;
	this.text.setTransform(182.5,12.1,2,2);

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#52A0F9").ss(2,1,1).p("AVCEjIHykeInykmMgx1gABIHyElInyEfg");
	this.shape.setTransform(184.4,30.1);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#52A0F9").ss(1.5,1,1).p("AiDhEIB4BBIh5BJAANhEIB4BBIh5BJ");
	this.shape_1.setTransform(304.7,31.3);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#52A0FB").s().p("A8zEiIHykeInykmMAx0AABIHzEmInzEegAS/BSIB4hMIh3g/IB3A/gAQtBSIB4hMIh3g/IB3A/g");
	this.shape_2.setTransform(184.4,30.1);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f().s("#00A89C").ss(2,1,1).p("AKhCRID5iPIj5iSI46AAID5CRIj5CQg");
	this.shape_3.setTransform(92.2,15.6);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("#FFFFFF").ss(1.5,1,1).p("AhBghIA8AgIg8AkAAGghIA8AgIg8Ak");
	this.shape_4.setTransform(152.3,16.2);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#00A89C").s().p("AuZCRID6iQIj6iRIY5ABID6CRIj6CPgAJfAoIA9glIg8geIA8AegAIWAoIA9glIg8geIA8Aeg");
	this.shape_5.setTransform(92.2,15.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape},{t:this.text,p:{scaleX:2,scaleY:2,x:182.5,y:12.1,text:"Measurements  >>",lineWidth:140}}]}).to({state:[{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.text,p:{scaleX:1,scaleY:1,x:79.8,y:7.6,text:"Measurments",lineWidth:101}}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,0,370.8,89.5);


(lib.lightblue_body = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#C3D8F2").s().p("AmFEiIAAkUIASgKIgSgJIAAkcIMLAAIAAJDg");
	this.shape.setTransform(39,29.1);

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,78,58.1);


(lib.grey_tail = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#C3D8F2").ss(1.5,1,1).p("ADwAOInfEUIHfAAADwkhInfAAIHfEc");
	this.shape.setTransform(24,29.1);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#C3D8F2").s().p("AjvEiIHekUIAAEUgAjvkhIHeAAIAAEcg");
	this.shape_1.setTransform(24,29.1);

	this.addChild(this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-1,-1,50,60.1);


(lib.grey_head = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#C3D8F2").ss(1.5,1,1).p("Aj6EiIAFAAIHwkeInwklIgFAA");
	this.shape.setTransform(25.2,29.1);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#C3D8F2").s().p("Aj6EiIAApDIAFAAIHwElInwEeg");
	this.shape_1.setTransform(25.2,29.1);

	this.addChild(this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-1,-1,52.3,60.1);


(lib.cyan_tail = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#88CBC3").ss(0.1,1,1).p("AD6khInzAAIHwElInwEeIHzAA");
	this.shape.setTransform(25,29.1);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#88CBC3").s().p("Aj5EiIHwkeInwklIHzAAIAAJDg");
	this.shape_1.setTransform(25,29.1);

	this.addChild(this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-1,-1,52,60.1);


(lib.cyan_head = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#88CBC3").ss(0.1,1,1).p("Aj0EdIHpkZInpkg");
	this.shape.setTransform(24.5,28.6);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#88CBC3").s().p("Aj0kcIHoEgInoEZg");
	this.shape_1.setTransform(24.5,28.6);

	this.addChild(this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-1,-1,51,59.2);


(lib.cBtn = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// Layer 1
	this.text = new cjs.Text("Customize   >>", "15px 'Arial'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 17;
	this.text.lineWidth = 117;
	this.text.setTransform(138.6,11,2,2);

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#52A0F9").ss(1.5,1,1).p("AANhFIB4BBIh5BKAiDhFIB4BBIh5BK");
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


(lib.bluer_body = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#52A0FB").s().p("AmAEiIAAkZIAJgFIgJgEIAAkhIL+AAIADACIAAJAIgDABg");
	this.shape.setTransform(38.5,29.1);

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,77,58.1);


(lib.blue_tail = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#52A0FB").ss(1.5,1,1).p("AD1AIInpEaIHpAAAD1khInpAAIHpEh");
	this.shape.setTransform(24.5,29.1);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#52A0FB").s().p("Aj0EiIHokZIAAEZgAj0khIHoAAIAAEhg");
	this.shape_1.setTransform(24.5,29.1);

	this.addChild(this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-1,-1,51,60.1);


(lib.blue_head = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#52A0FB").ss(1.5,1,1).p("Aj3EhIHvkdInvkk");
	this.shape.setTransform(24.8,28.9);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#52A0FB").s().p("Aj3kgIHuEkInuEdg");
	this.shape_1.setTransform(24.8,28.9);

	this.addChild(this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-1,-1,51.6,59.9);


(lib.blue_body = function() {
	this.initialize();

	// Layer 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#88CBC3").s().p("AmFEiIAApDIMDAAIAIAFIAAI6IgIAEg");
	this.shape.setTransform(39,29.1);

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,78,58.1);


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
	this.flasher.setTransform(86.6,29.5,2,2,0,0,0,44.3,15);

	this.timeline.addTween(cjs.Tween.get(this.flasher).wait(6));

	// Layer 1
	this.body = new lib.blue_body();
	this.body.setTransform(91,29.6,1,1,0,0,0,39,29.1);

	this.head = new lib.cyan_head();
	this.head.setTransform(154.5,29.6,1,1,0,0,0,24.5,28.6);

	this.tail = new lib.cyan_tail();
	this.tail.setTransform(27,29.6,1,1,0,0,0,25,29.1);

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FFFFFF").ss(0.1,1,1).p("AGGkcIgJgFIsCAAAmFEiIMCAAIAJgE");
	this.shape.setTransform(91,29.6);

	this.body_1 = new lib.bluer_body();
	this.body_1.setTransform(87.5,29.1,1,1,0,0,0,38.5,29.1);

	this.head_1 = new lib.blue_head();
	this.head_1.setTransform(150.8,29.1,1,1,0,0,0,24.8,28.9);

	this.tail_1 = new lib.blue_tail();
	this.tail_1.setTransform(24.5,29.1,1,1,0,0,0,24.5,29.1);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FFFFFF").ss(1.5,1,1).p("Al/AAIAIAEIgIAEAl/EiIL+AAAF/khIr+AA");
	this.shape_1.setTransform(87.4,29.1);

	this.body_2 = new lib.lightblue_body();
	this.body_2.setTransform(87,29.1,1,1,0,0,0,39,29.1);

	this.tail_2 = new lib.grey_tail();
	this.tail_2.setTransform(24,29.1,1,1,0,0,0,24,29.1);

	this.head_2 = new lib.grey_head();
	this.head_2.setTransform(151.2,29.1,1,1,0,0,0,25.2,29.1);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FFFFFF").ss(1.5,1,1).p("AmFgFIASAJIgSAKAmFEiIMLAAAGGkhIsLAA");
	this.shape_2.setTransform(87,29.1);

	this.body_3 = new lib.orange_body();
	this.body_3.setTransform(88.5,29.1,1,1,0,0,0,39.5,29.1);

	this.tail_3 = new lib.orange_tail();
	this.tail_3.setTransform(24.5,29.1,1,1,0,0,0,24.5,29.1);

	this.head_3 = new lib.orange_head();
	this.head_3.setTransform(152.1,29.1,1,1,0,0,0,24.1,28.1);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f().s("#FFFFFF").ss(1.5,1,1).p("AGLkYIgQgJIsFAAAmKEiIMFAAIAQgJAmKAAIAIAEIgIAE");
	this.shape_3.setTransform(88.5,29.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.tail,p:{alpha:1}},{t:this.head,p:{alpha:1}},{t:this.body,p:{alpha:1}}]}).to({state:[{t:this.shape_1},{t:this.tail_1},{t:this.head_1},{t:this.body_1}]},1).to({state:[{t:this.shape_2},{t:this.head_2},{t:this.tail_2},{t:this.body_2}]},1).to({state:[{t:this.shape_3},{t:this.head_3},{t:this.tail_3},{t:this.body_3}]},1).to({state:[{t:this.tail,p:{alpha:0.609}},{t:this.head,p:{alpha:0.609}},{t:this.body,p:{alpha:0.609}}]},1).to({state:[{t:this.tail,p:{alpha:0.352}},{t:this.head,p:{alpha:0.352}},{t:this.body,p:{alpha:0.352}}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2,-0.5,181.1,60.1);


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
	this.done = new cjs.Text("0%", "34px 'Arial'", "#4F9DFF");
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