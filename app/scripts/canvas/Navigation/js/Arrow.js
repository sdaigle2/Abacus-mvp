var span = document.getElementById("nav_span"); //Div DOM Elment
span.style.visibility = "hidden";

var Arrow = function(image, name, page, x, width, custom){
  this.complete = false;
  this.page = page;
  this.index = page.index;
  var index = page.index;
  this.name = name;
  this.custom = custom;
  this.mc = new lib.Arrow();
  var transWidth = width/180;
  this.mc.setTransform(0,0,transWidth,1);
  stage.addChild(this.mc);
  this.mc.x = x;
  this.mc.y = 1;
  this.image = image;
  var mc = this.mc;
  mc.addEventListener("click", pressed);
  mc.addEventListener("mouseover", hover_on);
  mc.addEventListener("rollout", hover_off);
  var image = this.image;
  var me = this;
  gotoAndStop(image);
  function pressed(m){

    if(custom){
      customChanged();
      lastCustomArrow = me;
    }else{
      lastMeasureArrow = me;
    }
    focusedIndex= index;

    myScope.pageSwitchJump(page);
    //TODO better completion detection
    me.complete = true;
    calcCompleteness();

    if(custom && arrowFocus){
      arrowFocus.gotoAndStop(1);
    }
    if(!custom){
      if(arrowFocus.page.visitstatus==="visited"){
        arrowFocus.gotoAndStop(1);
      }else{
        arrowFocus.gotoAndStop(2);
      }
    }
    arrowFocus = me;
    image = 3;
    mc.gotoAndStop(image);
  }
  this.pressed = pressed;

  function hover_on(m){
    var ratio = canvasWidth/$(window).width();
    span.style.visibility = "visible";
    if(image === 4){
      mc.gotoAndStop(5);
    }
    span.innerHTML = name;
    span.style.left = mc.x/ratio+"px";
  }

  function hover_off(m){
    mc.gotoAndStop(image);
    span.style.visibility = "hidden";
  }

  function gotoAndStop(integer){
    image = integer;
    mc.gotoAndStop(integer);
  }
  this.gotoAndStop = gotoAndStop;

  function flash(){
    mc.flasher.gotoAndPlay(1);
  }
  this.flash = flash;
}
