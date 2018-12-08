const mongoose = require('mongoose'),
      Alert = mongoose.model('alert');

exports.getAll = function(req, res) {
  Alert.find(req.query).lean().exec(function(err, alerts) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ alerts });
    }
  });
};

exports.addAlert = function(req, res) {
  var new_alert = new Alert(req.body);
  new_alert.save(function(err, alert) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ alert });
    }
  });
};

exports.getAlert = function(req, res) {
  Alert.findById(req.params.alert_id, function(err, alert) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ alert });
    }
  });
};

exports.updateAlert = function(req, res) {
  Alert.findByIdAndUpdate(req.params.alert_id, req.body, { new: true }, function(err, alert) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ alert });
    }
  });
};

exports.deleteAlert = function(req, res) {
  Alert.findByIdAndDelete(req.params.alert_id, function(err, alert) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ alert });
    }
  });
};
