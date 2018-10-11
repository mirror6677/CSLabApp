const mongoose = require('mongoose'),
      Assignment = mongoose.model('assignment'),
      Course = mongoose.model('semester_course');

exports.getAll = function(req, res) {
  Assignment.find({}, function(err, assignments) {
    if (err)
      res.send({error: err});
    res.json({ assignments });
  });
};

exports.addAssignment = function(req, res) {
  var new_assignment = new Assignment(req.body);
  new_assignment.save(function(err, assignment) {
    if (err) {
      res.send({error: err});
    } else {
      Course.findByIdAndUpdate(
        req.params.course_id,
        { $push: { assignments: mongoose.Types.ObjectId(assignment._id) } },
        function(err, course) {
          if (err)
            res.send({ error: err });
          res.json({ course, assignment });
        }
      );
    }
  });
};

exports.getAssignment = function(req, res) {
  Assignment.findById(req.params.assignment_id, function(err, assignment) {
    if (err)
      res.send({ error: err });
    res.json({ assignment });
  });
};

exports.updateAssignment = function(req, res) {
  Assignment.findByIdAndUpdate(req.params.assignment_id, req.body, { new: true }, function(err, assignment) {
    if (err)
      res.send({ error: err });
    res.json({ assignment });
  });
};

exports.deleteAssignment = function(req, res) {
  Assignment.findById(req.params.assigment_id, function(err, assignment) {
    if (err) {
      res.send({ error: err });
    } else {
      Course.update(
        {},
        { $pull: { assignments: mongoose.Types.ObjectId(assignment._id) } }, 
        function(err, course) {
          if (err) {
            res.send({ error: err });
          } else {
            Problem.remove(
              { '_id': { $in: assignment.problems.map(id => mongoose.Types.ObjectId(id)) } }, 
              function(err) {
                if (err) {
                  res.send({ error: err });
                } else {
                  assignment.remove(function(err) {
                    if(err)
                      res.send({ error: err });
                    res.json({ course, assignment });
                  });
                }
              }
            );
          }
        }
      )
    }
  });
};
