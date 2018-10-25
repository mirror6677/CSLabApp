'use strict';
module.exports = function(app) {
  var works = require('../controllers/work-controller');

  app.route('/works')
    .get(works.getAll)
    .post(works.addWork);

  app.route('/works/:work_id')
    .get(works.getWork)
    .put(works.updateWork)
    .delete(works.deleteWork);
};
