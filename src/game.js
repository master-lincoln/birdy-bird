define(['bird', 'pipe'], function(bird, Pipe) {
  "use strict";
  
  var offsetX = 640;
  
  var atlas = null;
  var atlasMap = {};
  
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
  
  function init(game) {
    
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
    
    return Promise.all([promImg, promMap]);
  }
  
  function tick() {
    offsetX -= 1;
    bird.tick();
    
    var collision = false;
    pipes.forEach(function(pipe, i) {
      pipe.getBoundingBoxes().forEach(function(bb) {
        collision |= bird.collidesWith(bb);
      });
    });
    bird.drawBB(collision);
  }
  
  function drawBG(ctx) {
    drawImage("bg", 0, 0, ctx);
    drawImage("bg", 288, 0, ctx);
    drawImage("bg", 2*288, 0, ctx);
  }
  
  function drawGround(ctx) {
    // TODO let it scroll
    drawImage("land", 0, 400, ctx);
    drawImage("land", 288, 400, ctx);
    drawImage("land", 2*288, 400, ctx);
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
    // 16 ms (increase to make game faster)
    tickTime: ~~(1/60 *1000),
    
    // last tick UNIX timestamp 
    lastTickTime : window.performance.now(),

    // how far offoffsetset the canvas is
    getOffsetX: function() { return offsetX; },
    
    // functions
    init: init,
    tick: tick,
    render: render,
    drawImage: drawImage
  };
});