/*
  Bobble
  Simulated time environment for JavaScript
*/
var Bobble = (function(global) {
  return function(src) {
    var originals  = {
      setTimeout: global.setTimeout,
      setInterval: global.setInterval,
      clearTimeout: global.clearTimeout,
      clearInterval: global.clearInterval,
      postMessage: global.postMessage,
      addEventListener: global.addEventListener,
      Date: global.Date
    };
    
    var BobbleAPI = (function(global) {
      var bobbleTime        = 0;
      var timeouts          = [];
      var intervals         = [];
      var posted_messages   = [];
      var message_receivers = [];
      
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
        var i = collection.length;
        while(i--) {
          tc = collection[i];
          if (tc.fireAgain && bobbleTime - tc.lastFired >= tc.ms) {
            tc.fn();
            tc.lastFired = bobbleTime;
            tc.fireAgain = repeat;
          }
        }
      };
      
      function advanceReceivers(receivers, messages) {
        var i, message;
        while(messages.length) {
          message = messages.pop();
          i = receivers.length;
          while(i--) { receivers[i](message); }
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
        Native: {
          setTimeout: function(fn, ms) { return tcPsh(timeouts, fn, ms); },
          setInterval: function(fn, ms) { return tcPsh(intervals, fn, ms); },
          clearTimeout: function(id) { timeouts[id - 1].fireAgain = false; },
          clearInterval: function(id) { intervals[id - 1].fireAgain = false; },
          postMessage: function(data, targetOrigin) {
            posted_messages.push({
                data: data,
                origin: window.location,
                source: window.location
              });
            },
          addEventListener: function(event, fn, useCapture) {
            if ('message' == event) {
              message_receivers.push(fn);
            } else {
              originals.addEventListener.apply(originals, arguments);
            }
          },
          Date: Date
        },
        Controls: {
          advanceToTime: function(time) {
            if (time < bobbleTime) {
              throw("Can't go back in time");
            } else {
              bobbleTime = time;
              advanceReceivers(message_receivers, posted_messages);
              advanceTc(timeouts, false); // timeouts which don't repeat
              advanceTc(intervals, true); // intervals which do repeat
            }
          }
        }
      };
    })(global);
    
    this.run = function() {
      var setTimeout    = BobbleAPI.Native.setTimeout;
      var clearTimeout  = BobbleAPI.Native.clearTimeout;
      var setInterval   = BobbleAPI.Native.setInterval;
      var clearInterval = BobbleAPI.Native.clearInterval;
      var postMessage   = BobbleAPI.Native.postMessage;
      var Date          = BobbleAPI.Native.Date;
      var alert = function(s) { console.log("alert: %o", s); };
      
      var advanceToTime = BobbleAPI.Controls.advanceToTime;
      
      // Override definitions of functions attached to the global object
      (function(global) {
        global.setTimeout       = setTimeout;
        global.clearTimeout     = clearTimeout;
        global.setInterval      = setInterval;
        global.clearInterval    = clearInterval;
        global.Date             = Date;
        global.postMessage      = postMessage;
        global.addEventListener = BobbleAPI.Native.addEventListener;
        
        eval(src);
      })(global);
      
      
      // Swap original definitions of global functions back into place
      global.setTimeout    = originals.setTimeout;
      global.clearTimeout  = originals.clearTimeout;
      global.setInterval   = originals.setInterval;
      global.clearInterval = originals.clearInterval;
      global.Date          = originals.Date;
      global.postMessage   = originals.postMessage;
    };
  };
})(this);
