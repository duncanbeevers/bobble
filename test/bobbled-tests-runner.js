var TestPublicAPI = (function() {
  var result_template = new Template($$('.js-test-result-template')[0].innerHTML);
  var summary_template = new Template($$('.js-test-results-summary-template')[0].innerHTML);
  
  var assertions_count;
  var failures = [];
  var successes = [];
  var body = document.getElementsByTagName('body')[0];
  
  function pl(n, s) {
    return 1 == n ? s : s + (s.match(/(s?)$/)[1] ? 'es' : 's');
  };
  function pluralize(n, s) { return n + ' ' + pl(n, s); }
  
  document.observe('dom:loaded', function() {
    $$('.js-test').each(function(t) {
      var result_message = null, failed = false;
      assertions_count = 0;
      
      try {
        new Bobble(t.innerHTML);
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
        result_message: (result_message || '') + '\n' + pluralize(assertions_count, 'Assertion')
      };
      if (failed) {
        template_env.test_result = 'failure';
        failures.push(result_message);
      } else {
        template_env.test_result = 'success';
        successes.push(t);
      }
      body.insert(result_template.evaluate(template_env));
    });
    
    body.insert(summary_template.evaluate({
      failures_count: pluralize(failures.length, 'Failure'),
      successes_count: pluralize(successes.length, 'Success')
    }));
  });
  
  return {
    assertEquals: function(expected, actual, message) {
      assertions_count++;
      if (expected != actual) { throw(message || ("Expected " + expected + " to equal " + actual)); }
    },
    assertThrows: function(fn, message) {
      var threw = false;
      try { fn(); } catch(_) { threw = true; }
      assertEquals(true, threw, message || ("Expected " + fn + " to have thrown"));
    }
  };
})();

var assertEquals = TestPublicAPI.assertEquals;
var assertThrows = TestPublicAPI.assertThrows;
