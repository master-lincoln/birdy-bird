define(['bird', 'pipe', 'score', '../lib/promise-0.1.1.min'], function(bird, Pipe, score) {
  "use strict";
  
  var offsetX = 0;
  var groundLevel = 450; 
  
  var atlas = null;
  var atlasMap = {};
  var game = null;
  
  var pipes = [];
  
  var flash = false;
  
  var bgCanvas = document.createElement('canvas');
  bgCanvas.width = 640;
  bgCanvas.height = 480;
  var bgCtx = bgCanvas.getContext('2d');
  
  function drawImage(name, x, y, ctx) {
    var el = atlasMap[name];
    if (el) {
      ctx.drawImage(atlas, el.x, el.y, el.w, el.h, x, y, el.w, el.h);
    } else {
      console.error("Couldn't find '%s' in atlas", name);
    }
  }
  
  function parseAtlasMap(data) {
    var lines = data[0].split('\n');
    lines.forEach(function(line) {
      var elements = line.split(' ');
      atlasMap[elements[0]] = {
        w: elements[1],
        h: elements[2],
        x: elements[3] * atlas.width,
        y: elements[4] * atlas.height
      };
    });
  }
  
  function init(theGame) {
    game = theGame;
    var preloadImage = function(resolve, reject) {
      atlas = new Image();
      atlas.src = 'img/orig-atlas.png';
      atlas.onload = function() { resolve(); };
    };
    
    var preloadMap = function(resolve, reject) {
      var oReq = new XMLHttpRequest();
      oReq.onload = function(e) { 
        resolve(e.target.response);
      };
      oReq.open("get", "img/orig-atlas.txt", false);
      oReq.send();
    };
    
    var promImg = new Promise(preloadImage);
    var promMap = new Promise(preloadMap);

    score.init(game);
    bird.init(game);
    pipes.push(new Pipe(game));
    pipes.push(new Pipe(game));
    pipes.push(new Pipe(game));
    
    return Promise.all([promMap, promImg])
                  .then(parseAtlasMap)
                  .then(function() {
                    drawImage("bg", 0, 0, bgCtx);
                    drawImage("bg", 288, 0, bgCtx);
                    drawImage("bg", 2*288, 0, bgCtx); 
                  });
  }
  
  function addAndRemovePipes() {
    var lastPipe = pipes[pipes.length-1];
    // add new pipe at the end
    if (lastPipe &&
        lastPipe.getX()-offsetX < game.SIZE[0]) {
      pipes.push(new Pipe(game));
    }
    // remove first pipe if offscreen
    if (pipes[0] &&
        pipes[0].getX()-offsetX < -pipes[0].getBoundingBoxes()[0].w) {
      pipes.shift();
    }
  }
  
  function checkCollisions() {
    var collision = false;
    pipes.forEach(function(pipe, i) {
      pipe.getBoundingBoxes().forEach(function(bb) {
        collision |= bird.collidesWith(bb);
      });
    });
    
    if ( bird.getLowerBound() >= groundLevel || collision ) {
      score.resetPoints();
      bird.die();
      flash = true;
    }
  }
  
  function addScoreIfPipePassed() {
    pipes.forEach(function(pipe) {
      var pipeRightOuter = pipe.getX()+pipe.getBoundingBoxes()[0].w;
      if ( !pipe.passed &&
           pipeRightOuter <bird.getPosition().x) {
        pipe.passed = true;
        score.addPoint();
      }
    });
  }
  
  function tick(delta) {
    var moveX =delta/16;
    offsetX += moveX;
    
    bird.tick(moveX, delta);
    checkCollisions();
    addAndRemovePipes();
    addScoreIfPipePassed();
  }
  
  function drawBG(ctx) {
    ctx.drawImage(bgCanvas, 0, 0);
  }
  
  function drawGround(ctx) {
    // TODO let it scroll
    drawImage("land", 0, groundLevel, ctx);
    drawImage("land", 288, groundLevel, ctx);
    drawImage("land", 2*288, groundLevel, ctx);
  }
  
  var flashScreen = (function() {
    var frames = 3;
    return function(ctx) {
      if (flash) {
          ctx.beginPath();
          ctx.rect(0,0,game.SIZE[0], game.SIZE[1]);
          ctx.fillStyle = "rgba(200, 0, 0, 0.5)";
          ctx.fill();
          flash = false;
      }
    };
  })();
  
  function render(ctx) {
    ctx.save();
    drawBG(ctx);
    ctx.translate(-~~offsetX, 0);

    pipes.forEach(function(pipe) {
      pipe.draw(ctx);
    });
    
    bird.draw(ctx);
    
    ctx.restore();
    drawGround(ctx);
    score.draw(ctx);
    flashScreen(ctx);
  }
  
  return {
    SIZE : [640,480],
    
    // last tick UNIX timestamp 
    lastTickTime : window.performance.now(),

    getOffsetX: function() { return offsetX; },
    getGroundLevel: function() { return groundLevel; },
    init: init,
    tick: tick,
    render: render,
    drawImage: drawImage
  };
});