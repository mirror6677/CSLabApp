const mongoose = require('mongoose'),
      User = mongoose.model('user'),
      Course = mongoose.model('semester_course');

exports.getAll = function(req, res) {
  User.find({}).lean().exec(function(err, users) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ users });
    }
  });
};

exports.addUser = function(req, res) {
  var new_user = new User(req.body);
  new_user.save(function(err, user) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ user });
    }
  });
};

exports.getUser = function(req, res) {
  User.findById(req.params.user_id, function(err, user) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ user });
    }
  });
}

exports.updateUser = function(req, res) {
  User.findByIdAndUpdate(req.params.user_id, req.body, { new: true }, function(err, user) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ user });
    }
  });
}

exports.deleteUser = function(req, res) {
  User.findById(req.params.user_id, function(err, user){
    if (err) {
      res.send({ error: err });
    } else {
      Course.update(
        {},
        { 
          $pull: { professors: mongoose.Types.ObjectId(user._id) }, 
          $pull: { TAs: mongoose.Types.ObjectId(user._id) }, 
          $pull: { students: mongoose.Types.ObjectId(user._id) } 
        },
        function (err, course) {
          if(err) {
            res.send({ error: err });
          } else {
            user.remove(function(err){
              if (err) {
                res.send({ error: err });
              } else {
                res.json({ user, course });
              }
            });
          }
        }
      )
    }
  });
}

exports.getUserByUsername = function(req, res) {
  User.findOne({ username: req.params.username }, function(err, user) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ user });
    }
  });
}
