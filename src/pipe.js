define(['difficulty'], function(difficulty) {
  "use strict";
  
  var lastX = 250;
  
  var Pipe = function(game) {
    this.game = game;
    this.height = 270;
    this.width = 52;
    this.passed = false;
    
    this.gap = difficulty.getPipeGap();
    var newX = lastX + difficulty.getPipeDistance();
    lastX = newX;
    this.position = {x:newX, y: Math.random()*210+210};
  };
  
  Pipe.prototype.tick = function() {  };
  
  Pipe.prototype.getBoundingBoxes = function() {    
    return [{
      x: this.position.x,
      y: this.position.y,
      w: this.width,
      h: this.height
    }, {
      x: this.position.x,
      y: this.position.y-this.gap-this.height,
      w: this.width,
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
    this.game.drawImage('pipe_down', x, y-this.gap-this.height, ctx);
  };
    
  return Pipe;
  
});