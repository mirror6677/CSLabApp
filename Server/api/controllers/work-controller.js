const mongoose = require('mongoose'),
      Work = mongoose.model('work');

exports.getAll = function(req, res) {
  Work.find(req.query).lean().exec(function(err, works) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ works });
    }
  });
};

exports.addWork = function(req, res) {
  var new_work = new Work(req.body);
  new_work.save(function(err, work) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ work });
    }
  });
};

exports.getWork = function(req, res) {
  Work.findById(req.params.work_id, function(err, work) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ work });
    }
  });
};

exports.updateWork = function(req, res) {
  Work.findByIdAndUpdate(req.params.work_id, req.body, { new: true }, function(err, work) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ work });
    }
  });
};

exports.deleteWork = function(req, res) {
  Work.findById(req.params.work_id, function(err, work) {
    if (err) {
      res.send({ error: err });
    } else {
      work.remove(function(err) {
        if(err) {
          res.send({ error: err });
        } else {
          res.json({ work });
        }
      });
    }
  });
};
