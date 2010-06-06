function assertEquals(expected, actual, message) {
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
      var template_env = {
        function_body: t.innerHTML,
        test_result: 'success'
      };
      
      try {
        new Bobble(Date, t.innerHTML);
        successes.push(t.innerHTML);
      } catch(e) {
        template_env.test_result = 'failure';
        template_env.failure_message = e;
        failures.push(e);
      }
      body.insert(result_template.evaluate(template_env));
    });
    
    body.insert(summary_template.evaluate({
      failures: failures.length,
      successes: successes.length
    }));
  });
  
})();
