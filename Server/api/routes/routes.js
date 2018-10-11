'use strict';
module.exports = function(app) {
  var auth_routes = require('./auth-routes');
  var course_routes = require('./course-routes');
  var assignment_routes = require('./assignment-routes');
  var problem_routes = require('./problem-routes');
  var user_routes = require('./user-routes');

  auth_routes(app);
  course_routes(app);
  assignment_routes(app);
  problem_routes(app);
  user_routes(app);
};
