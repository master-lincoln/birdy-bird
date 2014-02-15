require([
  '../lib/domReady!',
  'game',
  'bird',
  ], function(d, game, bird) {
  'use strict';
  
  var can = document.getElementById('canvas1');
  var ctx = can.getContext('2d');
  can.tabIndex = 1; // quick way to get focus so keypresses register
  can.focus();
    
  var jumpPressed = false;
    
  var jumpHandler = function() { bird.jump(); };
    
  can.addEventListener("touchstart", jumpHandler, false);
  can.addEventListener("mousedown", jumpHandler, false);
    
  can.addEventListener('keydown', function(e) {
      if (e.keyCode === 32 && !jumpPressed) { // space
        jumpPressed = true;
          bird.jump();
      }
  }, false);
    
   can.addEventListener('keyup', function(e) {
    if (e.keyCode === 32) { // space
        jumpPressed = false;
    }
   }, false);

  function tickPassed(time) {
    var ticked = (time - game.lastTickTime) >= game.tickTime;
    if (ticked) {
      game.lastTickTime = time;
    }
    return ticked; 
  }
  
  function mainLoop(time) {
    if (tickPassed(time)) {
      game.tick();
      game.render(ctx);
          
    }
    window.requestAnimationFrame(mainLoop);
  }

  game.init(game).then(function() {
    window.requestAnimationFrame(mainLoop);
  });
              
});