const mongoose = require('mongoose'),
      Course = mongoose.model('semester_course');

exports.getAll = function(req, res) {
  Course.find({}).lean().exec(function(err, courses) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ courses });
    }
  });
};

exports.addCourse = function(req, res) {
  var new_course = new Course(req.body);
  new_course.save(function(err, course) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ course });
    }
  });
};

exports.getCourse = function(req, res) {
  Course.findById(req.params.course_id, function(err, course) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ course });
    }
  });
};

exports.getActiveCourse = function(_, res) {
  Course.find({ active: true }).lean().exec(function(err, courses) {
    if (err) {
      res.send({ error: err });
    } else {
      if (courses.length > 0) {
        res.json({ course: courses[courses.length - 1] });
      } else {
        res.send({ error: 'No active course' })
      }
    }
  });
};

exports.updateCourse = function(req, res) {
  Course.findByIdAndUpdate(req.params.course_id, req.body, { new: true }, function(err, course) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ course });
    }
  });
};

exports.deleteCourse = function(req, res) {
  Course.findByIdAndUpdate(req.params.course_id, { deleted: true }, { new: true }, function(err, course) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ course });
    }
  });
};
