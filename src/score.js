define([], function() {
  "use strict";
  
  var points = 0;
  var maxPoints = 0;
  
  var game;
  
  function init(theGame) {
    game = theGame;
  }
  
  function draw(ctx) {
    var pos = {x:20, y:20};
    
    var strPoints = points.toString();
    strPoints.split('').forEach(function(c,i) {
      game.drawImage("number_score_0"+c, pos.x+i*15, pos.y, ctx); 
    });
    
    var strMaxPoints = maxPoints.toString();
    strMaxPoints.split('').forEach(function(c,i) {
      game.drawImage("number_context_0"+c, pos.x+5+i*13, pos.y+25, ctx); 
    });
  }
  
  function resetPoints() {
    points = 0;
  }
  
  function addPoint() {
    points += 1;
    maxPoints = Math.max(points, maxPoints);
  }
  
  return {
    init: init,
    draw: draw,
    resetPoints: resetPoints,
    addPoint: addPoint
  };
  
});