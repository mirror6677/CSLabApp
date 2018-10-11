'use strict';
module.exports = function(app) {
  var problems = require('../controllers/problem-controller');

  app.route('/problems')
    .get(problems.getAll);

  app.route('/problems/:assignment_id')
    .post(problems.addProblem);

  app.route('/problems/:problem_id')
    .get(problems.getProblem)
    .put(problems.updateProblem)
    .delete(problems.deleteProblem);
};
