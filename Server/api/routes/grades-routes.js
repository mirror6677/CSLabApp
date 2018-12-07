'use strict'
module.exports = function(app) {
  var grades = require('../controllers/grades-controller');

  app.route('/grades/:course_id')
    .get(grades.getGrades)
}