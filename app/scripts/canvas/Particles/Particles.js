// ----------------------------------------
// Actual game code goes here.

// 
//Global 
//vars

fps = null;
canvas = null;
ctx = null;
var mouseX=0;
var mouseY=0;
var num_particles = 500;
var particles = new Array();
// ----------------------------------------

function fillCircle(ctx , x, y, radius){
	ctx.beginPath();
    ctx.fillStyle="#FFFFFF"; 
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
	ctx.fill();
}


var Particle = function () {
	var FRICTION = .995;
	this.x = Math.random()*canvas.width;
	this.y = Math.random()*canvas.height/2;
	this.xVel = Math.random()*10-5;
	this.yVel = Math.random()*.2-.1;
	this.radius = 1;
	var me = this;
	function onEvent(){
		fillCircle(ctx , me.x, me.y, me.radius);
		me.y+=me.yVel;
		me.x+=me.xVel;
		me.xVel*=FRICTION;
		//me.yVel*=FRICTION:
	}
	this.onEvent = onEvent;
}



function mouseEvent(evt){
  var mousePos = getMousePos(canvas, evt);
  mouseX = mousePos.x;
  mouseY= mousePos.y;
}

function part_init(num_particles){
	canvas = document.getElementById("canvy");
	ctx = canvas.getContext("2d");
	fps = new FPSMeter("fpsmeter", document.getElementById("fpscontainer"));
	canvas.addEventListener('mousemove', mouseEvent); 
	window.addEventListener( "keydown", doKeyDown, false ); 
	window.addEventListener( "keyup", doKeyUp, false ); 
	GameLoopManager.run(GameTick);
	for(var i=0; i<num_particles; i++){
		particles.push(new Particle());
	}
}

window.onload = function () {
	part_init(num_particles);	
};

function doKeyDown(e){
	console.log(e.keyCode);
}

function doKeyUp(e){
	//nothing
}


function GameTick(elapsed)
{
	fps.update(elapsed);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//ctx.fillStyle="black";
	//ctx.fillRect(0,0,canvas.width,canvas.height); 
	for(var i=0; i<particles.length; i++){
		particles[i].onEvent();
	}

	/*
	ctx.fillStyle = bgcol;
    ctx.drawImage(background, 0,0, canvas.width, canvas.height);
	ctx.fillStyle = "grey";
	ctx.fillRect(0+shakeX, 380+shakeY, 550, 50);
        ctx.fillStyle = "red";

	ctx.font = 'bold 15pt Calibri';
	ctx.fillText(testmess, 100, 100);
	ctx.drawImage(arrayz[frame], posX+shakeX, posY-5+shakeY,75,75);
	//ctx.drawImage(arrayz[0],somex,20,75,75);

	ctx.fillRect(25+shakeX, 385+shakeY, health, 10);
	*/
}


 
function getMousePos(canvas, evt) {
var rect = canvas.getBoundingClientRect();
 return {
	 	 x: evt.clientX - rect.left,
         y: evt.clientY - rect.top
 };   
 }