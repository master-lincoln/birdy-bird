define([], function() {
  "use strict";
  
  var lastX = 250;
  var pipeDistance = 250;
  
  var Pipe = function(game) {
    this.GAP = 100;
    this.game = game;
    this.height = 270;
    this.widths = 52;
    this.passed = false;
    var newX = lastX + pipeDistance;
    lastX = newX;
    this.position = {x:newX, y:Math.random()*250+150};
  };
  
  Pipe.prototype.tick = function() {  };
  
  Pipe.prototype.getBoundingBoxes = function() {    
    return [{
      x: this.position.x,
      y: this.position.y,
      w: this.widths,
      h: this.height
    }, {
      x: this.position.x,
      y: this.position.y-this.GAP-this.height,
      w: this.widths,
      h: this.height
    }];
  };
  
  Pipe.prototype.getX = function() {
    return this.position.x;
  };
  
  Pipe.prototype.draw = function(ctx) {
    var x = this.position.x;
    var y = this.position.y;
    this.game.drawImage('pipe_up', x, y, ctx);
    this.game.drawImage('pipe_down', x, y-this.GAP-this.height, ctx);
  };
    
  return Pipe;
  
});