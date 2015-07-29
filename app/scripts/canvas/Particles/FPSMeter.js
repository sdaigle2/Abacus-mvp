// ----------------------------------------
// By Javier Arevalo
// FPS Meter class

FPSMeter = function (cls, root)
{
	this.fpsArray = new Array();
	this.fpsIndex = 0;
	this.fps = document.createElement("div");
	this.fps.setAttribute("class", cls);
	root.appendChild(this.fps);
	this.fpst = new Array();
	for (var i = 0; i < 3; ++i)
	{
		this.fpst.push(this.fps.appendChild(document.createElement("p")));
	}
}

FPSMeter.prototype.constructor = FPSMeter;

FPSMeter.prototype.update = function (elapsed)
{
	if (this.fpsArray.length < 100)
	{
		this.fpsArray.push(elapsed);
	}
	else
	{
		this.fpsArray[this.fpsIndex] = elapsed;
		this.fpsIndex = (this.fpsIndex + 1) % this.fpsArray.length;
	}
	var min = this.fpsArray[0], max = this.fpsArray[0], avg = 0;
	this.fpsArray.forEach(function(o, i, a) {
		if (min > o) min = o;
		if (max < o) max = o;
		avg += o;
	});
	avg /= this.fpsArray.length;
	this.fpst[0].textContent = "min: " + min.toFixed(3) + " max: " + max.toFixed(3);
	this.fpst[1].textContent = "avg: " + avg.toFixed(3) + " fps: " + (1/avg).toFixed(0);
	this.fpst[2].textContent = "current: " + elapsed.toFixed(3);
}