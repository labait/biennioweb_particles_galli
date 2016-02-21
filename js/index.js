// some parts taken from http://jsfiddle.net/inkfood/juzsR/

var DEBUG = true
var boxArray = []
var maxBalls = 0
var speed = 10
var speedLimit = 4
var boxRadius= 200
var zooming = false
var animation_enabled = true

$(function(){
  init();
})


 window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(/* function */ callback, /* DOMElement */ element){
              window.setTimeout(callback, 1000 / 60);
            };
  })();



function init(){

  $("body").click(function(event){
    animation_enabled = !animation_enabled
  })
  //maxBalls = $("#wrapper .box").length
  var minDist = window.innerHeight / $("#wrapper .box").length;
	//for (var i=0;i<maxBalls;i++){
  $("#wrapper .box").each(function(i, box){
    maxBalls+=1
    box = $(box)
    box.css({
      width: boxRadius+"px",
      height: boxRadius+"px"
    })
    //box.append('<a href="#" class="zoomTarget">link</a>')
    box.addClass("zoomTarget")
		box.addClass("box")

		box.left =Math.round(Math.random()*window.innerWidth-boxRadius);
		//box.top = Math.round(Math.random()*390);
    box.top = Math.random() * (i*minDist+50 - i*minDist) + i*minDist;
		box.collision = 0;
		box.mass = 1;
		box.xspeed = Math.round(Math.random()*speed-speed/2);
		box.yspeed = Math.round(Math.random()*speed-speed/2);

    $('wrapper').append(box);

    box.data().collision_count = 0

    box.on("mouseover", function(event){
      if(!zooming) {
        $(this).addClass("over")
        $(this).css("z-index",maxBalls+1)
      }
    })

    box.on("mouseout", function(event){
      if(!zooming) {
        $(this).removeClass("over")
        $(this).css("z-index",maxBalls-1)
      }
    })

    box.on("click", function(event){
        /*if(!zooming) {

        var zoomSettings = {
          closeclick: true,
          nativeanimation: true,
          //root: $("#zoomContainer"),
          animationendcallback: function(e){
            zooming = true
          }
        }
        $(this).zoomTo(zoomSettings);

        $(this).find(".content").show()
        zooming = true

      }
      */
    })

    $("body").on("click", function(){
      /*
      $(".box").removeClass("over")
      $(".box").find(".content").hide()
      zooming = false
      */
    })

		boxArray.push(box);


	})
	if(boxArray.length == maxBalls) tick()

  //
  if(DEBUG) {
    $(".box").css("border", "1px solid black")
    $(".box img").css("border", "1px solid green")
  }
}


function moveBall(){

}


function tick(){
  if(animation_enabled){
    for (x in boxArray){
       var box1 = boxArray[x]
       box1.collisions = 0
       //console.log("zooming: "+zooming)
       if(!box1.hasClass("over") && !zooming){
         // BOUNDARIES
         if (box1.left<0) {box1.left = 0;box1.xspeed *= -1;}
         if (box1.left>window.innerWidth-boxRadius) {box1.left = window.innerWidth-boxRadius;box1.xspeed *= -1;}
         if (box1.top<0) {box1.top = 0;box1.yspeed *= -1;}
         if (box1.top>window.innerHeight-boxRadius) {box1.top = innerHeight-boxRadius;box1.yspeed *= -1;}

         // get new position
         box1.left += box1.xspeed;
         box1.top += box1.yspeed;

         // apply new position
         box1.css('transform', "translate("+box1.left+"px,"+box1.top+"px)") //2D Transform
         //box1.style.WebkitTransform = "translate3D("+box1.left+"px,"+box1.top+"px,0px)";//3D Transform fo better Performance?? -> "testing"
         //box1.MozTransform = "translate3D("+box1.left+"px,"+box1.top+"px,0px)";

         // setting info
         var collision_count = box1.data().collision_count
         var info_text = collision_count
         var info_text_size_em = 1+1*collision_count/1000
         box1.find(".info").css("font-size", info_text_size_em+"em")
         box1.find(".info").text(box1.attr("id")+" | "+info_text)
       }


      for (y=0; y<boxArray.length; y++) {
        var box2 = boxArray[y]
        distance_x = Math.abs(box1.left-box2.left);
        distance_y = Math.abs(box1.top-box2.top);
        distance = Math.abs(Math.sqrt(distance_x*distance_x+distance_y*distance_y));

        if(y!=x){
          if (distance<=boxRadius){

            box2.addClass("collision")
            box1.collisions += 1
            box2.collisions += 1

            /**/
            manage_bounce(box1, box2);
            //break;
            //console.log($(box).data().collision_count)
          } else {
          }
        }
        if(box1.collisions > 0) {
          box1.addClass("collision")
        } else {
          box1.removeClass("collision")
        }
        if(box2.collisions > 0) {
          box2.addClass("collision")
        } else {
          box2.removeClass("collision")
        }

        console.log("controllo "+box1.attr("id")+" con "+box2.attr("id")+", distance: "+distance)


      }
    }
    console.log("-------------------")
    requestAnimFrame( tick ); //RUN THE NEXT TICK
  }
}


function manage_bounce(box1, box2) {
  /*
  box1.data().collision_count++;
  box2.data().collision_count++;

  dx = box1.left-box2.left;
  dy = box1.top-box2.top;
  collisionision_angle = Math.atan2(dy, dx);
  magnitude_1 = Math.sqrt(box1.xspeed*box1.xspeed+box1.yspeed*box1.yspeed);
  magnitude_2 = Math.sqrt(box2.xspeed*box2.xspeed+box2.yspeed*box2.yspeed);
  direction_1 = Math.atan2(box1.yspeed, box1.xspeed);
  direction_2 = Math.atan2(box2.yspeed, box2.xspeed);
  new_xspeed_1 = magnitude_1 * Math.cos(direction_1-collisionision_angle);
  new_yspeed_1 = magnitude_1 * Math.sin(direction_1-collisionision_angle);
  new_xspeed_2 = magnitude_2 * Math.cos(direction_2-collisionision_angle);
  new_yspeed_2 = magnitude_2 * Math.sin(direction_2-collisionision_angle);
  final_xspeed_1 = ((box1.mass-box2.mass) * new_xspeed_1+(box2.mass+box2.mass) * new_xspeed_2)/(box1.mass+box2.mass);
  final_xspeed_2 = ((box1.mass+box1.mass) * new_xspeed_1+(box2.mass-box1.mass) * new_xspeed_2)/(box1.mass+box2.mass);
  final_yspeed_1 = new_yspeed_1;
  final_yspeed_2 = new_yspeed_2;
  box1.xspeed = Math.cos(collisionision_angle) * final_xspeed_1+Math.cos(collisionision_angle+Math.PI/2) * final_yspeed_1;
  box1.yspeed = Math.sin(collisionision_angle) * final_xspeed_1+Math.sin(collisionision_angle+Math.PI/2) * final_yspeed_1;
  box2.xspeed = Math.cos(collisionision_angle) * final_xspeed_2+Math.cos(collisionision_angle+Math.PI/2) * final_yspeed_2;
  box2.yspeed = Math.sin(collisionision_angle) * final_xspeed_2+Math.sin(collisionision_angle+Math.PI/2)*final_yspeed_2;
  */

}
