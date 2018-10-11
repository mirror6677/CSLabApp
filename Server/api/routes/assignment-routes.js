'use strict';
module.exports = function(app) {
  var assignments = require('../controllers/assignment-controller');

  app.route('/assignments')
    .get(assignments.getAll);

  app.route('/assignments/:course_id')
    .post(assignments.addAssignment);

  app.route('/assignments/:assignment_id')
    .get(assignments.getAssignment)
    .put(assignments.updateAssignment)
    .delete(assignments.deleteAssignment);
};
