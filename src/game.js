define(['bird', 'pipe'], function(bird, Pipe) {
  "use strict";
  
  var offsetX = 640;
  var groundLevel = 450; 
  
  var atlas = null;
  var atlasMap = {};
  var game = null;
  
  var pipes = [];
  
  function drawImage(name, x, y, ctx) {
    var el = atlasMap[name];
    if (el) {
      ctx.drawImage(atlas, el.x, el.y, el.w, el.h, x, y, el.w, el.h);
    } else {
      console.error("Couldn't find '%s' in atlas", name);
    }
  }
  
  function parseAtlasMap(data) {
    var lines = data.split('\n');
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
        parseAtlasMap(e.target.response);
        resolve();
      };
      oReq.open("get", "img/orig-atlas.txt", true);
      oReq.send();
    };
    
    var promImg = new Promise(preloadImage);
    var promMap = new Promise(preloadMap);

    bird.init(game);
    pipes.push(new Pipe(game));
    pipes.push(new Pipe(game));
    pipes.push(new Pipe(game));
    pipes.push(new Pipe(game));
    pipes.push(new Pipe(game));
    
    return Promise.all([promImg, promMap]);
  }
  
  function addAndRemovePipes() {
    var lastPipe = pipes[pipes.length-1];
    // add new pipe at the end
    if (lastPipe &&
        lastPipe.getX()+offsetX < game.SIZE[0]) {
      pipes.push(new Pipe(game));
    }
    // remove first pipe if offscreen
    if (pipes[0] &&
        pipes[0].getX()+offsetX < -pipes[0].getBoundingBoxes()[0].w) {
      pipes.shift();
    }
  }
  
  function tick() {
    offsetX -= game.tickTime/16;
    bird.tick();
    
    addAndRemovePipes();
    
    var collision = false;
    pipes.forEach(function(pipe, i) {
      pipe.getBoundingBoxes().forEach(function(bb) {
        collision |= bird.collidesWith(bb);
      });
    });
    var bbG ={
      x: offsetX,
      y: groundLevel,
      w: game.SIZE[0],
      h: game.SIZE[1]-groundLevel
    };
    if ( bird.collidesWith(bbG) ) {
      bird.die();
    }
    
    bird.drawBB(collision);
  }
  
  function drawBG(ctx) {
    drawImage("bg", 0, 0, ctx);
    drawImage("bg", 288, 0, ctx);
    drawImage("bg", 2*288, 0, ctx);
  }
  
  function drawGround(ctx) {
    // TODO let it scroll
    drawImage("land", 0, groundLevel, ctx);
    drawImage("land", 288, groundLevel, ctx);
    drawImage("land", 2*288, groundLevel, ctx);
  }
  
  function render(ctx) {
    ctx.save();

    drawBG(ctx);
    drawGround(ctx);
    
    ctx.translate(offsetX, 0);

    pipes.forEach(function(pipe, i) {
      pipe.draw(ctx);
    });
    
    bird.draw(ctx);
    
    ctx.restore();
  }
  
  return {
    SIZE : [640,480],
    
    // 16 ms (decrease to make game faster)
    tickTime: ~~(1/60 *1000),
    
    // last tick UNIX timestamp 
    lastTickTime : window.performance.now(),

    // how far offset the canvas is
    getOffsetX: function() { return offsetX; },
    
    // functions
    init: init,
    tick: tick,
    render: render,
    drawImage: drawImage
  };
});