// some parts taken from http://jsfiddle.net/inkfood/juzsR/

var boxArray = []
var maxBalls = 0
var speed = 10
var speedLimit = 4
var boxRadius= 200
var zooming = false

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



function init()
{
  maxBalls = $("#wrapper .box").length
  var minDist = window.innerHeight / maxBalls;
	//for (var i=0;i<maxBalls;i++){
  $("#wrapper .box").each(function(i, box){
    $(box).css({
      width: boxRadius+"px",
      height: boxRadius+"px"
    })
    //$(box).append('<a href="#" class="zoomTarget">link</a>')
    $(box).addClass("zoomTarget")
		$(box).addClass("box")

		box.left =Math.round(Math.random()*window.innerWidth-boxRadius);
		//box.top = Math.round(Math.random()*390);
    box.top = Math.random() * (i*minDist+50 - i*minDist) + i*minDist;
		box.collision = 0;
		box.mass = 1;
		box.xspeed = Math.round(Math.random()*speed-speed/2);
		box.yspeed = Math.round(Math.random()*speed-speed/2);

    document.getElementById('wrapper').appendChild(box);

    $(box).data().collision_count = 0
    $(box).find(".info").text(i)

    $(box).on("mouseover", function(event){
      if(!zooming) {
        $(this).addClass("over")
        $(this).css("z-index",maxBalls+1)
      }
    })

    $(box).on("mouseout", function(event){
      if(!zooming) {
        $(this).removeClass("over")
        $(this).css("z-index",maxBalls-1)
      }
    })

    $(box).on("click", function(event){
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
      $(".box").removeClass("over")
      $(".box").find(".content").hide()
      zooming = false
    })

		boxArray.push(box);


	})
	if(boxArray.length == maxBalls) tick()
}

function addSpeed()
{
}

function moveBall(){
		for (var i=0;i<maxBalls;i++) {
      var box = boxArray[i]
      var $box = $(box)
      //console.log("zooming: "+zooming)
      if(!$box.hasClass("over") && !zooming){
        // BOUNDARIES
        // left
  			if (box.left<0) {box.left = 0;box.xspeed *= -1;}
        // right
  			if (box.left>window.innerWidth-boxRadius) {box.left = window.innerWidth-boxRadius;box.xspeed *= -1;}
        // top
        if (box.top<0) {box.top = 0;box.yspeed *= -1;}
        // bottom
  			if (box.top>window.innerHeight-boxRadius) {box.top = innerHeight-boxRadius;box.yspeed *= -1;}

  			// get new position
  			box.left += box.xspeed;
  			box.top += box.yspeed;

  			// apply new position
  			box.style.WebkitTransform = "translate("+box.left+"px,"+box.top+"px)";//2D Transform
  			//box.style.WebkitTransform = "translate3D("+box.left+"px,"+box.top+"px,0px)";//3D Transform fo better Performance?? -> "testing"
        box.style.MozTransform = "translate3D("+box.left+"px,"+box.top+"px,0px)";

        // setting info
        var collision_count = $(box).data().collision_count
        var info_text = collision_count
        var info_text_size_em = 1+1*collision_count/1000
        $(box).find(".info").css("font-size", info_text_size_em+"em")
        $(box).find(".info").text(info_text)
      }

		}
   		//box.style.WebkitTransform = "translate("+box.dx+"px,"+box.dy+"px)";
}

function manage_bounce(box, box2) {

    dx = box.left-box2.left;
    dy = box.top-box2.top;
    collisionision_angle = Math.atan2(dy, dx);
    magnitude_1 = Math.sqrt(box.xspeed*box.xspeed+box.yspeed*box.yspeed);
    magnitude_2 = Math.sqrt(box2.xspeed*box2.xspeed+box2.yspeed*box2.yspeed);
    direction_1 = Math.atan2(box.yspeed, box.xspeed);
    direction_2 = Math.atan2(box2.yspeed, box2.xspeed);
    new_xspeed_1 = magnitude_1 * Math.cos(direction_1-collisionision_angle);
    new_yspeed_1 = magnitude_1 * Math.sin(direction_1-collisionision_angle);
    new_xspeed_2 = magnitude_2 * Math.cos(direction_2-collisionision_angle);
    new_yspeed_2 = magnitude_2 * Math.sin(direction_2-collisionision_angle);
    final_xspeed_1 = ((box.mass-box2.mass) * new_xspeed_1+(box2.mass+box2.mass) * new_xspeed_2)/(box.mass+box2.mass);
    final_xspeed_2 = ((box.mass+box.mass) * new_xspeed_1+(box2.mass-box.mass) * new_xspeed_2)/(box.mass+box2.mass);
    final_yspeed_1 = new_yspeed_1;
    final_yspeed_2 = new_yspeed_2;
    box.xspeed = Math.cos(collisionision_angle) * final_xspeed_1+Math.cos(collisionision_angle+Math.PI/2) * final_yspeed_1;
    box.yspeed = Math.sin(collisionision_angle) * final_xspeed_1+Math.sin(collisionision_angle+Math.PI/2) * final_yspeed_1;
    box2.xspeed = Math.cos(collisionision_angle) * final_xspeed_2+Math.cos(collisionision_angle+Math.PI/2) * final_yspeed_2;
    box2.yspeed = Math.sin(collisionision_angle) * final_xspeed_2+Math.sin(collisionision_angle+Math.PI/2)*final_yspeed_2;

    //


}


function tick(){
  moveBall()
  for (x=0; x<=maxBalls; x++)
   {
      for (y=x+1; y<maxBalls; y++)
      {
      	distance_x = Math.abs(boxArray[x].left-boxArray[y].left);
      	distance_y = Math.abs(boxArray[x].top-boxArray[y].top);
      	distance = Math.abs(Math.sqrt(distance_x*distance_x+distance_y*distance_y));

        if(distance < boxRadius)
        {

        }

      	if (distance<=boxRadius+1 && (boxArray[x].collision == 0 || boxArray[y].collision == 0)){
      		boxArray[x].collision = 1;
          boxArray[y].collision = 1;

          /*
          manage_bounce(boxArray[x], boxArray[y]);
          var box1 = boxArray[x]
          var box2 = boxArray[y]
          $(box1).data().collision_count++;
          $(box2).data().collision_count++;
          //console.log($(box).data().collision_count)
          if($(box1).data().collision_count > $(box1).data().collision_count) {
            $(box2).remove()
            //boxArray.splice(x, 1);
          } else {
            //$(box1).remove()
            //boxArray.splice(y, 1);
          }
          */


      	}
      	else if (distance>boxRadius+1){
              boxArray[x].collision = 0;
              boxArray[y].collision = 0;
        }

      	//window.console.log(distance)
      }
   }
  requestAnimFrame( tick );//RUN THE NEXT TICK
}
