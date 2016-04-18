var span = document.getElementById("nav_span"); //Div DOM Elment
span.style.visibility = "hidden";
var tailShift = 1;
var headShift = 2;

var Arrow = function(image, name, page, x, width, custom){
  this.complete = false;
  this.page = page;
  this.index = page.index;
  var index = page.index;
  this.name = name;
  this.custom = custom;
  this.mc = new lib.Arrow();
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

  //The arrow is composed of three inner MC's the head, body and tail
  //The following transforms the body and arranges the head/tail.
  //NOTES:
  //head width = 50
  //tail width = 50
  var tails = [mc.tail,mc.tail_1,mc.tail_2,mc.tail_3];
  var heads = [mc.head,mc.head_1,mc.head_2,mc.head_3];
  var bodys = [mc.body,mc.body_1,mc.body_2,mc.body_3];
  width-=100;
  for(var i=0; i<tails.length; i++){
    var transWidth = width/80;
    bodys[i].setTransform(50,0,transWidth,1);
    tails[i].x+=tailShift;
    heads[i].x=70+width+headShift;
  }



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
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return pressed(m);
    }
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
