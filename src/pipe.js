define([], function() {
  "use strict";
  
  var Pipe = function(game) {
    this.game = game;
    this.position = {x:200, y:100};
  };
  
  Pipe.prototype.tick = function() {  };
  
  Pipe.prototype.getBoundingBoxes = function() {
    return [{
      x: -this.position.x,
      y: this.position.y,
      w: 52,
      h: 250
    }];
  };
  
  Pipe.prototype.draw = function(ctx) {
    var x = this.position.x;
    var y = this.position.y;
    this.game.drawImage('pipe_up', x, y, ctx);
    
    // TODO delete this debugging code
    /* draw translucent bounding boxes
    this.getBoundingBoxes().forEach(function(bb) {
      ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
      ctx.fillRect(bb.x , bb.y, bb.w, bb.h);
    });
    //*/
  };
    
  return Pipe;
  
});