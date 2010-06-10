/*
  Bobble
  Simulated time environment for JavaScript
*/
var Bobble = (function(global) {
  return function(src) {
    var originals  = {
      Date: global.Date,
      setTimeout: global.setTimeout,
      setInterval: global.setInterval,
      clearTimeout: global.clearTimeout,
      clearInterval: global.clearInterval
    };
    
    var BobblePublicAPI = (function(global) {
      var bobbleTime = 0;
      var timeouts   = [];
      var intervals  = [];
      
      var tcPsh = function(cl, fn, ms) {
        cl.push({
          fn: fn,
          ms: ms,
          lastFired: bobbleTime,
          fireAgain: true
        });
        return cl.length;
      };
      
      function advanceTc(collection, repeat) {
        var tc;
        for (var i = 0; i < collection.length; i++) {
          tc = collection[i];
          if (tc.fireAgain && bobbleTime - tc.lastFired >= tc.ms) {
            tc.fn();
            tc.lastFired = bobbleTime;
            tc.fireAgain = repeat;
          }
        }
      };
      
      var Date = function() {
        var a = arguments, base;
        switch(a.length) {
          case 0: base = new originals.Date(bobbleTime); break;
          case 1: base = new originals.Date(a[0]); break;
          case 2: base = new originals.Date(a[0], a[1]); break;
          case 3: base = new originals.Date(a[0], a[1], a[2]); break;
          case 4: base = new originals.Date(a[0], a[1], a[2], a[3]); break;
          case 5: base = new originals.Date(a[0], a[1], a[2], a[3], a[4]); break;
          case 6: base = new originals.Date(a[0], a[1], a[2], a[3], a[4], a[5]); break;
          case 7: base = new originals.Date(a[0], a[1], a[2], a[3], a[4], a[5], a[6]);
        };
        base.__proto__ = Date.prototype;
        return base;
      };
      Date.prototype = { __proto__: originals.Date.prototype, constructor: Date };
      
      
      return {
        setTimeout: function(fn, ms) { return tcPsh(timeouts, fn, ms); },
        setInterval: function(fn, ms) { return tcPsh(intervals, fn, ms); },
        clearTimeout: function(id) { timeouts[id - 1].fireAgain = false; },
        clearInterval: function(id) { intervals[id - 1].fireAgain = false; },
        advanceToTime: function(time) {
          if (time < bobbleTime) {
            throw("Can't go back in time");
          } else {
            bobbleTime = time;
            advanceTc(timeouts, false); // timeouts which don't repeat
            advanceTc(intervals, true); // intervals which do repeat
          }
        },
        Date: Date
      };
    })(global);
    
    var setTimeout    = BobblePublicAPI.setTimeout;
    var clearTimeout  = BobblePublicAPI.clearTimeout;
    var setInterval   = BobblePublicAPI.setInterval;
    var clearInterval = BobblePublicAPI.clearInterval;
    var Date          = BobblePublicAPI.Date;
    var advanceToTime = BobblePublicAPI.advanceToTime;
    var alert = function(s) { console.log("alert: %o", s); };
    
    // Override definitions of functions attached to the global object
    (function(global) {
      global.setTimeout    = setTimeout;
      global.clearTimeout  = clearTimeout;
      global.setInterval   = setInterval;
      global.clearInterval = clearInterval;
      global.Date          = Date;
      
      eval(src);
    })(global);
    
    
    // Swap original definitions of global functions back into place
    global.setTimeout    = originals.setTimeout;
    global.clearTimeout  = originals.clearTimeout;
    global.setInterval   = originals.setInterval;
    global.clearInterval = originals.clearInterval;
    global.Date          = originals.Date;
  };
})(this);
