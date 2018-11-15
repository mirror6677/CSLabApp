'use strict';
module.exports = function(app) {
  var tests = require('../controllers/test-controller');

  app.route('/tests')
    .get(tests.getAll);

  app.route('/tests/:problem_id')
    .post(tests.addTest);

  app.route('/tests/:test_id')
    .get(tests.getTest)
    .put(tests.updateTest)
    .delete(tests.deleteTest);

  app.route('/tests/:type/:test_content_id')
    .put(tests.updateTestContent)
};
