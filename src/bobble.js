/*
  Bobble
  Simulated time environment for JavaScript
*/
function Bobble(src) {
  var setTimeout = function() {};
  var clearTimeout = function() {};
  var setInterval = function() {};
  var clearInterval = function() {};
  var Date = function() {};
  Date.prototype = {};
  
  var alert = function(s) { console.log("alert: %o", s); };
  
  var advanceToTime = (function() {
    var bobbleTime = 0;
    return function(time) {
      if (time < bobbleTime) {
        throw("Can't go back in time");
      } else {
        bobbleTime = time;
      }
    };
  })();
  
  eval(src);
};

Bobble.prototype = {};
