Bobble
=

Simulated asynch environment for JavaScript

Usage
-

Create a new bobble with some asynchronous behavior.

    var bobble = new Bobble("
      var a = false;
      setTimeout(function() { a = true; }, 100);
      advanceToTime(100);
      console.log(a);
    ");
    
Within the bobble time can be manually advanced using <tt>advanceToTime</tt> to execute scheduled events.
You can <tt>advanceToTime</tt> with the same value to trigger instantaneous events like those scheduled by <tt>postMessage</tt>

Ask the bobble to execute its payload.

    bobble.run();

Simulated
-

Inside the bobble, time-dependent asynchronous JavaScript is executed synchronously, and the passage of time is metered out manually.
The system simulates:

* setTimeout
* setInterval
* clearTimeout
* clearInterval
* postMessage
* window.addEventListener('message', receiver)
* Date
