/*
  Bobble
  Simulated time environment for JavaScript
*/
function Bobble(src) {
  var BobblePublicAPI = (function() {
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
    
    return {
      setTimeout: function(fn, ms) { return tcPsh(timeouts, fn, ms); },
      setInterval: function(fn, ms) { return tcPsh(intervals, fn, ms); },
      advanceToTime: function(time) {
        if (time < bobbleTime) {
          throw("Can't go back in time");
        } else {
          bobbleTime = time;
          advanceTc(timeouts, false); // events which don't repeat
          advanceTc(intervals, true); // events which do repeat
        }
      }
    };
  })();
  
  var setTimeout    = BobblePublicAPI.setTimeout;
  var clearTimeout  = BobblePublicAPI.clearTimeout;
  var setInterval   = BobblePublicAPI.setInterval;
  var clearInterval = BobblePublicAPI.setInterval;
  var Date          = BobblePublicAPI.Date;
  var advanceToTime = BobblePublicAPI.advanceToTime;
  var alert = function(s) { console.log("alert: %o", s); };
  
  eval(src);
};

Bobble.prototype = {};
