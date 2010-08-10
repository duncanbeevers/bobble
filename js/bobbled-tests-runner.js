var TestPublicAPI = (function() {
  var result_template = new Template('                                     \
  <div class="js-test-result-status js-test-result-status-#{test_result}"> \
    <pre class="js-test-body">#{function_body}</pre>                       \
    <pre class="js-test-result-message">#{result_message}</pre>            \
  </div>');
  var summary_template = new Template('                                    \
  <div class="js-test-results-summary">                                    \
    <h2>#{successes_count}, #{failures_count}</h2>                         \
  </div>');
  
  var assertions_count;
  var failures = [];
  var successes = [];
  var results_container = $('results');
  
  function pl(n, s) { return 1 == n ? s : s + (s.match(/(s?)$/)[1] ? 'es' : 's'); };
  function pluralize(n, s) { return n + ' ' + pl(n, s); }
  function cat(s1, s2) { return s1 ? s1 + "\n" + s2 : s2; }
  
  document.observe('dom:loaded', function() {
    $$('.js-test').each(function(t) {
      var result_message = null, failed = false, bobble;
      assertions_count = 0;
      
      try {
        bobble = new Bobble(t.innerHTML);
        bobble.run();
        if (0 == assertions_count) {
          failed = true;
          result_message = 'No assertions made';
        }
      } catch(e) {
        failed = true;
        result_message = e;
      }
      
      var template_env = {
        function_body: t.innerHTML,
        result_message: cat(result_message, pluralize(assertions_count, 'Assertion'))
      };
      if (failed) {
        template_env.test_result = 'failure';
        failures.push(result_message);
      } else {
        template_env.test_result = 'success';
        successes.push(t);
      }
      results_container.insert(result_template.evaluate(template_env));
    });
    
    results_container.insert(summary_template.evaluate({
      failures_count: pluralize(failures.length, 'Failure'),
      successes_count: pluralize(successes.length, 'Success')
    }));
  });
  
  return {
    assertEquals: function(expected, actual, message) {
      assertions_count++;
      if (expected != actual) { throw(cat(message, ("Expected " + expected + ", but was " + actual))); }
    },
    assertThrows: function(fn, message) {
      var threw = false;
      try { fn(); } catch(_) { threw = true; }
      assertEquals(true, threw, cat(message, ("Expected " + fn + " to have thrown")));
    }
  };
})();

var assertEquals = TestPublicAPI.assertEquals;
var assertThrows = TestPublicAPI.assertThrows;
