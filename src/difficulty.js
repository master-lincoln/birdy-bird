define([], function() {
  "use strict";
  
  var levels = [
    {
      minPoints: 0,
      pipeDistance: 220,
      pipeGap: 150,
      speed: 1
    },
    {
      minPoints: 3,
      pipeDistance: 220,
      pipeGap: 120,
      speed: 1.5
    },
    {
      minPoints: 8,
      pipeDistance: 210,
      pipeGap: 110,
      speed: 2
    },
    {
      minPoints: 15,
      pipeDistance: 200,
      pipeGap: 100,
      speed: 2.2
    }
  ];
  
  var currentLevel = 0;
  
  function nextLevelNum() {
    return currentLevel < levels.length-1 ? currentLevel+1 : currentLevel;
  }
    
  return {
    reset: function() {
      currentLevel = 0;
    },
    qualifiedForNextLevel: function(points) {
      return (points >= levels[nextLevelNum()].minPoints) &&
             (currentLevel != levels.length-1);
    },
    advanceLevel: function() {
        currentLevel = nextLevelNum();
    },
    getPipeDistance: function() {
      return levels[currentLevel].pipeDistance;
    },
    getPipeGap: function() {
      return levels[currentLevel].pipeGap;
    },
    getSpeedFactor: function() {
      return levels[currentLevel].speed;
    },
  };
  
});