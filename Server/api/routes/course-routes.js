'use strict';
module.exports = function(app) {
  var courses = require('../controllers/course-controller');

  app.route('/courses')
    .get(courses.getAll)
    .post(courses.addCourse);

  app.route('/course/getActiveCourse')
    .get(courses.getActiveCourse)

  app.route('/courses/:course_id')
    .get(courses.getCourse)
    .put(courses.updateCourse)
    .delete(courses.deleteCourse);
};
