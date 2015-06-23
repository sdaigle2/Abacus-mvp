// ----------------------------------------
// Actual game code goes here.

// 
//Global 
//vars





// ----------------------------------------

function stackImages(canvy, image_dirs, width, height){
	

    setInterval(function(){ 

	    var ctx = canvy.getContext("2d");
		console.log("stacking images");
		ctx.fillStyle = "white";
	    ctx.fillRect(0, 0, canvy.width, canvy.height);
	    for(var i=0; i<image_dirs.length; i++){
	    	var image = new Image();
			image.src=image_dirs[i];
			ctx.drawImage(image, 0, 0, width, height);
	    }
     }, 50);
}



