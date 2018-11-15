const mongoose = require('mongoose'),
      Test = mongoose.model('test'),
      FilenameTest = mongoose.model('filename_test'),
      PylintTest = mongoose.model('pylint_test'),
      BlackboxTest = mongoose.model('blackbox_test'),
      Problem = mongoose.model('problem');

const FILENAME_TYPE = 'filename',
      PYLINT_TYPE = 'pylint',
      BLACKBOX_TYPE = 'blackbox';

exports.getAll = function(req, res) {
  Test.find({}, function(err, tests) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ tests });
    }
  });
};

exports.addTest = function(req, res) {
  const data = req.body;
  var new_test_content;
  if (data.type === FILENAME_TYPE) {
    new_test_content = new FilenameTest(data.content);
  } else if (data.type === PYLINT_TYPE) {
    new_test_content = new PylintTest(data.content);
  } else if (data.type === BLACKBOX_TYPE) {
    new_test_content = new BlackboxTest(data.content);
  } else {
    res.send({ error: 'Unknown test type' });
    return;
  }
  new_test_content.save(function(err, test_content) {
    if (err) {
      res.send({ error: err });
    } else {
      var new_test = new Test({ ...data, content: test_content._id });
      new_test.save(function(err, test) {
        if (err) {
          res.send({ error: err });
        } else {
          Problem.findByIdAndUpdate(
            req.params.problem_id,
            { $push: { tests: mongoose.Types.ObjectId(test._id) } },
            { new: true },
            function(err, problem) {
              if (err) {
                res.send({ error: err });
              } else {
                res.json({ problem, test, test_content })
              }
            }
          );
        }
      });
    }
  });
};

exports.getTest = function(req, res) {
  Test.findById(req.params.test_id, function(err, test) {
    if (err) {
      res.send({ error: err });
    } else {
      if (test.type === FILENAME_TYPE) {
        FilenameTest.findById(test.content, function(err, test_content) {
          if (err) {
            res.send({ error: err });
          } else {
            res.json({ test, test_content });
          }
        });
      } else if (test.type === PYLINT_TYPE) {
        PylintTest.findById(test.content, function(err, test_content) {
          if (err) {
            res.send({ error: err });
          } else {
            res.json({ test, test_content });
          }
        });
      } else if (test.type === BLACKBOX_TYPE) {
        BlackboxTest.findById(test.content, function(err, test_content) {
          if (err) {
            res.send({ error: err });
          } else {
            res.json({ test, test_content });
          }
        });
      } else {
        res.send({ error: 'Unknown test type' })
      }
    }
  });
};

exports.updateTest = function(req, res) {
  Test.findByIdAndUpdate(req.params.test_id, req.body, { new: true }, function(err, test) {
    if (err) {
      res.send({ error: err });
    } else {
      res.json({ test });
    }
  });
};

exports.updateTestContent = function(req, res) {
  const type = req.params.type;
  if (type === FILENAME_TYPE) {
    FilenameTest.findByIdAndUpdate(
      req.params.test_content_id, 
      req.body, 
      { new: true }, 
      function(err, test_content) {
        if (err) {
          res.send({ error: err });
        } else {
          res.json({ test_content });
        }
      }
    );
  }
};

exports.deleteTest = function(req, res) {
  Test.findById(req.params.test_id, function(err, test) {
    if (err) {
      res.send({ error: err });
    } else {
      Problem.update(
        {},
        { $pull: { tests: mongoose.Types.ObjectId(test._id) } }, 
        function(err, problem) {
          if (err) {
            res.send({ error: err });
          } else {
            FilenameTest.remove(
              { '_id': { $in: test.content.map(id => mongoose.Types.ObjectId(id)) } },
              function(err) {
                if (err) {
                  res.send({ error: err });
                } else {
                  test.remove(function(err) {
                    if(err) {
                      res.send({ error: err });
                    } else {
                      res.json({ problem, test });
                    }
                  });
                }
              }
            );
          }
        }
      );
    }
  });
};
