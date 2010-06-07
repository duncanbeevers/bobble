var assertions_count;

function assertEquals(expected, actual, message) {
  assertions_count++;
  if (expected != actual) { throw(message || ("Expected " + expected + " to equal " + actual)); }
};

function assertThrows(fn, message) {
  var threw = false;
  try { fn(); } catch(_) { threw = true; }
  if (!threw) { throw(message || ("Expected " + fn + " to have thrown")); }
};

(function() {
  var result_template = new Template($$('.js-test-result-template')[0].innerHTML);
  var summary_template = new Template($$('.js-test-results-summary-template')[0].innerHTML);
  var failures = [];
  var successes = [];
  var body = document.getElementsByTagName('body')[0];
  
  document.observe('dom:loaded', function() {
    $$('.js-test').each(function(t) {
      var failure_message = null;
      assertions_count = 0;
      
      try {
        new Bobble(t.innerHTML);
        if (0 == assertions_count) { failure_message = "No assertions made"; }
      } catch(e) {
        failure_message = e;
      }
      
      var template_env = { function_body: t.innerHTML };
      if (failure_message) {
        template_env.test_result = 'failure';
        template_env.failure_message = failure_message;
        failures.push(failure_message);
      } else {
        template_env.test_result = 'success';
        successes.push(t);
      }
      body.insert(result_template.evaluate(template_env));
    });
    
    body.insert(summary_template.evaluate({
      failures: failures.length,
      successes: successes.length
    }));
  });
  
})();
