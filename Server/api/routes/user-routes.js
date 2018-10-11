'use strict';
module.exports = function(app) {
  var users = require('../controllers/user_controller');

  app.route('/users')
    .get(users.getAll)
    .post(users.addUser);

  app.route('/users/:user_id')
    .get(users.getUser)
    .put(users.updateUser)
    .delete(users.deleteUser);
  
  app.route('/users/username/:username')
    .get(users.getUserByUsername)
};
