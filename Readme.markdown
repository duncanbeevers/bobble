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
* Date
