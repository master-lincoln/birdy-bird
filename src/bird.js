define([], function() {
  "use strict";
  var game;
  var position = {x:20, y:0};
  var boundingBox = {x:6, y:10, w:28};
  // current y velocity
  var velocity = 1;
  var GRAVITY = 30;
  var JUMP_HEIGHT = 60;
  
  var drawB = false;
  
  function init(thegame) {
    game = thegame;
  }
  
  function tick() {
    // calculate position and velocity using the 'velocity verlet' method
    var timeStep = 1/ game.tickTime;
    position.y += timeStep * (velocity + timeStep * GRAVITY / 2);
    velocity   += timeStep * GRAVITY;
  }
  
  function jump() {
    velocity = -JUMP_HEIGHT;
  }
  
  function drawBB(bool) {
    drawB = bool;
  }
  
  // TODO externalize collision algorithm
  function collidesWith(bb) {
    // find closests point in rectangle from circle center
    // if distance from there to circle center is small than radius
    // => collision
    var centerX = game.getOffsetX() + boundingBox.x + boundingBox.w/2;
    var centerY = position.y + boundingBox.y + boundingBox.w/2;
    var collision = false;
    var closestX, closestY;
    
    if (centerX  < bb.x)
        closestX = bb.x;
    else if (centerX  > bb.x + bb.w)
        closestX = bb.x + bb.w;
    else
        closestX = centerX ;
    
    if (centerY  < bb.y)
        closestY = bb.y;
    else if (centerY > bb.y + bb.h)
        closestY = bb.y + bb.h;
    else
        closestY = centerY ;
    
    var distance = function(fromX, fromY, toX, toY) {
      var a = Math.abs(fromX - toX);
      var b = Math.abs(fromY - toY);
      return Math.sqrt((a * a) + (b * b));
    };

    if (distance(centerX,centerY, closestX, closestY) < boundingBox.w/2)
        collision = true;
    
    return collision;
  }
  
  var draw = (function() {
    // closure to store animation frame index
    var anim = 0;
    var nextAnim = function() {
      anim = anim > 3*game.tickTime ? 0 : anim+1;
      return ~~(anim / 2) %3;
    };
    return function (ctx) {
      var x = position.x-game.getOffsetX();
      var y = position.y;
      var n = nextAnim();
      game.drawImage('bird_'+n, x, y, ctx);
      
      // TODO delete this debugging code
      //* draw translucent bounding box
        var bb = boundingBox;
        ctx.beginPath();
        ctx.arc(x+bb.x+bb.w/2, y+bb.y+bb.w/2, bb.w/2, 0, 2*Math.PI, false);
        ctx.fillStyle = drawB ? "rgba(200, 0, 0, 0.5)" : "rgba(0, 200, 0, 0)";
        ctx.fill();
      //*/
    };
  })();
    
  return {
    init: init,
    draw: draw,
    tick: tick,
    jump: jump,
    collidesWith: collidesWith,
    drawBB: drawBB
  };
  
});