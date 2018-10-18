const mongoose = require('mongoose'),
      Course = mongoose.model('semester_course');

exports.getAll = function(req, res) {
  Course.find({}).lean().exec(function(err, courses) {
    if (err)
      res.send({ error: err });
    res.json({ courses });
  });
};

exports.addCourse = function(req, res) {
  console.log(req.body)
  var new_course = new Course(req.body);
  new_course.save(function(err, course) {
    if (err) {
      console.log(err)
      res.send({ error: err });
    }
    res.json({ course });
  });
};

exports.getCourse = function(req, res) {
  Course.findById(req.params.course_id, function(err, course) {
    if (err)
      res.send({ error: err });
    res.json({ course });
  });
};

exports.getActiveCourse = function(req, res) {
  Course.findOne({ active: true }, function(err, course) {
    if (err)
      res.send({ error: err });
    res.json({ course });
  });
};

exports.updateCourse = function(req, res) {
  Course.findByIdAndUpdate(req.params.course_id, req.body, { new: true }, function(err, course) {
    if (err)
      res.send({ error: err });
    res.json({ course });
  });
};

exports.deleteCourse = function(req, res) {
  Course.findByIdAndUpdate(req.params.course_id, { deleted: true }, { new: true }, function(err, course) {
    if (err)
      res.send({ error: err });
    res.json({ course });
  });
}
