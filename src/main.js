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
  var correctEvent = function(e) {
    return (e.keyCode === 32 || e instanceof MouseEvent || e instanceof TouchEvent);
  };
    
  var pressHandler = function(e) {
    if (correctEvent(e) && !jumpPressed) {
      e.preventDefault();
      jumpPressed = true;
      game.triggerInput();
    }
  };
  var releaseHandler = function(e) {
    if (correctEvent(e)) {
      jumpPressed = false;
    }
  };
    
  can.addEventListener("touchstart", pressHandler, false);
  can.addEventListener("touchend", releaseHandler, false);
  can.addEventListener("mousedown", pressHandler, false);
  can.addEventListener("mouseup", releaseHandler, false);
  can.addEventListener('keydown', pressHandler, false);
  can.addEventListener('keyup', releaseHandler, false);
  
  function mainLoop(time) {
    var delta = time - game.lastTickTime;
    game.lastTickTime = time;
    
    game.tick(delta);
    game.render(ctx, delta);

    window.requestAnimationFrame(mainLoop);
  }

  game.init(game).then(function() {
    window.requestAnimationFrame(mainLoop);
  });
              
});