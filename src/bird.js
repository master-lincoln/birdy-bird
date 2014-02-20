define([], function() {
  "use strict";
  var game;
  
  // --- start values
  var position = {x:200, y:0};
  var velocity = 1; // current y velocity
  var alive = true;
  
  // --- constants
  // circle with r=w and offset=(x,y) at current position
  var boundingBox = {x:6, y:10, w:28};
  var GRAVITY = 35;
  var JUMP_HEIGHT = 60;
  var MAX_VELOCITY = 200;
  
  function init(thegame) {
    game = thegame;
    
    /** Converts numeric degrees to radians */
    if (typeof(Number.prototype.toRad) === "undefined") {
      Number.prototype.toRad = function() {
        return this * Math.PI / 180;
      };
    }
  }
  
  function tick(xMove, delta) {
    position.x += xMove;
    fallDown(delta);
  }
  
  function fallDown(delta) {
    // keep him below top and above bottom
    if ( position.y < -boundingBox.w/2 ) {
      position.y = -boundingBox.w/2;
      velocity = 0;
    } else if (getLowerBound() >= game.getGroundLevel() && velocity>0) {
      position.y = game.getGroundLevel()-boundingBox.w-boundingBox.y;
      velocity = 0;
    } else {
      // calculate position/velocity using the 'velocity verlet' integration
      // http://en.wikipedia.org/wiki/Verlet_integration#Velocity_Verlet
      var timeStep = delta/256;
      position.y += timeStep * (velocity + timeStep * GRAVITY/2);
      velocity   += timeStep * GRAVITY;
      velocity = Math.min(MAX_VELOCITY, velocity);
    }
  }
  
  function jump() {
    if (!alive)
      revive();
    
    velocity = -JUMP_HEIGHT;
  }
  
  // TODO externalize collision algorithm
  function collidesWith(bb) {
    // find closests point in rectangle from circle center
    // if distance from there to circle center is small than radius
    // => collision
    var centerX = position.x + boundingBox.x + boundingBox.w/2;
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
  
  function getLowerBound() { 
    return position.y + boundingBox.y + boundingBox.w;
  }
  
  function die() {
    alive = false;
  }
  
  function revive() {
    alive= true;
  }
  
  var draw = (function() {
    // closure to store animation frame index
    var anim = 0;
    var nextAnim = function() {
      anim = anim > 3*game.tickTime ? 0 : anim+1;
      return ~~(anim / 2) %3;
    };
    return function (ctx) {
      
      var angle = (velocity+JUMP_HEIGHT)*          // move velocity so it starts at 0
                  135/(MAX_VELOCITY+JUMP_HEIGHT) - // normalize by using ratio 'angles range'/'speedrange'
                  45,                              // and move 0 to 45 degree counterclockwise
                                                        
          offX = boundingBox.x + boundingBox.w/2,
          offY = boundingBox.y + boundingBox.w/2;
      
      ctx.save();
      ctx.translate(position.x+offX, position.y+offY);
      ctx.rotate(angle.toRad());
      ctx.translate(-offX, -offY);
      game.drawImage('bird_'+nextAnim(), 0, 0, ctx);
      ctx.restore();
    };
  })();
  
  function reset() {
    position = {x:200, y:0};
    velocity = 1; // current y velocity
    alive = true;
  }
    
  return {
    init: init,
    reset: reset,
    draw: draw,
    tick: tick,
    jump: jump,
    collidesWith: collidesWith,
    die: die,
    revive: revive,
    isAlive: function() { return alive; },
    getPosition: function() { return position; },
    getLowerBound: getLowerBound
  };
  
});