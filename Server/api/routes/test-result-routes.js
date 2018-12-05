'use strict';
module.exports = function(app) {
  var test_results = require('../controllers/test-result-controller');

  app.route('/test_results')
    .get(test_results.getAll)
    .post(test_results.addTestResult);

  app.route('/test_results/:test_result_id')
    .get(test_results.getTestResult)
    .put(test_results.updateTestResult)
    .delete(test_results.deleteTestResult);
};