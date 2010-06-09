/*
  Bobble
  Simulated time environment for JavaScript
*/
var Bobble = (function(global) {
  return function(src) {
    var BobblePublicAPI = (function(originalDate) {
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
          case 0: base = new originalDate(bobbleTime); break;
          case 1: base = new originalDate(a[0]); break;
          case 2: base = new originalDate(a[0], a[1]); break;
          case 3: base = new originalDate(a[0], a[1], a[2]); break;
          case 4: base = new originalDate(a[0], a[1], a[2], a[3]); break;
          case 5: base = new originalDate(a[0], a[1], a[2], a[3], a[4]); break;
          case 6: base = new originalDate(a[0], a[1], a[2], a[3], a[4], a[5]); break;
          case 7: base = new originalDate(a[0], a[1], a[2], a[3], a[4], a[5], a[6]);
        };
        base.__proto__ = Date.prototype;
        return base;
      };
      Date.prototype = { __proto__: originalDate.prototype, constructor: Date };
      
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
    })(global.Date);
    var setTimeout    = BobblePublicAPI.setTimeout;
    var clearTimeout  = BobblePublicAPI.clearTimeout;
    var setInterval   = BobblePublicAPI.setInterval;
    var clearInterval = BobblePublicAPI.clearInterval;
    var Date          = BobblePublicAPI.Date;
    var advanceToTime = BobblePublicAPI.advanceToTime;
    var alert = function(s) { console.log("alert: %o", s); };
    eval(src);
  };
})(this);
