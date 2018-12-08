'use strict';
module.exports = function(app) {
  var alerts = require('../controllers/alert-controller');

  app.route('/alerts')
    .get(alerts.getAll)
    .post(alerts.addAlert);

  app.route('/alerts/:alert_id')
    .get(alerts.getAlert)
    .put(alerts.updateAlert)
    .delete(alerts.deleteAlert);
  
  app.route('/alerts/user/:user_id')
    .get(alerts.getUserAlerts);
};