// ----------------------------------------
// Actual game code goes here.

//
//Global
//vars


// ----------------------------------------

function stackImages(canvy, image_dirs, width, height) {
  console.log(height);
  //interval is set so if image fails to load at first it would retry.
  var ctx = canvy.getContext("2d");
  ctx.clearRect(0, 0, canvy.width, canvy.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvy.width, canvy.height);
  setInterval(function () {
    //console.log("stacking images");
    for (var i = 0; i < image_dirs.length; i++) {
      var image = new Image();
      image.src = image_dirs[i].URL;
      ctx.drawImage(image, 0, 0, width, height);
    }
  }, 50);
}



