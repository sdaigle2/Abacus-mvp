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
  ctx.fillStyle = "transparent";
  ctx.fillRect(0, 0, canvy.width, canvy.height);
  //console.log("stacking images");
  var images = [];
  var loaded = [];
  for (var i = 0; i < image_dirs.length; i++) {
    loaded.push(false);
    var image = new Image();
    image.src = image_dirs[i].URL;
    images.push(image);
  }

  for(i = 0; i<images.length; i++){
    images[i].onload = (function (i) {
      return function () {
        loaded[i] = true;
        for(var j = i; j < loaded.length; j++){
          if(!loaded[j])
            break;
          ctx.drawImage(images[j], 0, 0, width, height);
        }
      }
    })(i);
  }
}



