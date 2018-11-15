const mongoose = require('mongoose'),
      Assignment = mongoose.model('assignment'),
      Problem = mongoose.model('problem');

exports.getAll = function(req, res) {
  Problem.find({}, function(err, problems) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ problems });
    }
  });
};

exports.addProblem = function(req, res) {
  var new_problem = new Problem(req.body);
  new_problem.save(function(err, problem) {
    if (err) {
      res.send({ error: err });
    } else {
      Assignment.findByIdAndUpdate(
        req.params.assignment_id,
        { $push: { problems: mongoose.Types.ObjectId(problem._id) } },
        { new: true },
        function(err, assignment) {
          if (err) {
            res.send({ error: err });
          } else {
            res.json({ assignment, problem });
          }
        }
      );
    }
  });
};

exports.getProblem = function(req, res) {
  Problem.findById(req.params.problem_id, function(err, problem) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ problem });
    }
  });
};

exports.updateProblem = function(req, res) {
  Problem.findByIdAndUpdate(req.params.problem_id, req.body, { new: true }, function(err, problem) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ problem });
    }
  });
};


exports.deleteProblem = function(req, res) {
  Problem.findById(req.params.problem_id, function(err, problem) {
    if (err) {
      res.send({ error: err });
    } else {
      Assignment.update(
        {},
        { $pull: { problems: mongoose.Types.ObjectId(problem._id) } }, 
        function(err, assignment) {
          if (err) {
            res.send({ error: err });
          } else {
            problem.remove(function(err) {
              if(err) {
                res.send({ error: err });
              } else {
                res.json({ assignment, problem });
              }
            });
          }
        }
      )
    }
  });
};
