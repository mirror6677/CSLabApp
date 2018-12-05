const mongoose = require('mongoose'),
      TestResult = mongoose.model('test_result');

exports.getAll = function(req, res) {
  TestResult.find({}).lean().exec(function(err, test_results) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ test_results });
    }
  });
};

exports.addTestResult = function(req, res) {
  var new_test_result = new TestResult(req.body);
  new_test_result.save(function(err, test_result) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ test_result });
    }
  });
};

exports.getTestResult = function(req, res) {
  TestResult.findById(req.params.test_result_id, function(err, test_result) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ test_result });
    }
  });
};

exports.updateTestResult = function(req, res) {
  TestResult.findByIdAndUpdate(req.params.test_result_id, req.body, { new: true }, function(err, test_result) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ test_result });
    }
  });
};

exports.deleteTestResult = function(req, res) {
  TestResult.findByIdAndDelete(req.params.test_result_id, function(err, test_result) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ test_result });
    }
  });
};