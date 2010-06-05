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
        lastFired: 0
      });
      return cl.length;
    };
    
    return {
      setTimeout: function(fn, ms) { return tcPsh(timeouts, fn, ms); },
      setInterval: function(fn, ms) { return tcPsh(intervals, fn, ms); },
      advanceToTime: function(time) {
        if (time < bobbleTime) {
          throw("Can't go back in time");
        } else {
          bobbleTime = time;
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
