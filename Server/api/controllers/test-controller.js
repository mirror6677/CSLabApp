const mongoose = require('mongoose'),
      Test = mongoose.model('test'),
      FilenameTest = mongoose.model('filename_test'),
      PylintTest = mongoose.model('pylint_test'),
      BlackboxTest = mongoose.model('blackbox_test'),
      Problem = mongoose.model('problem');

const FILENAME_TYPE = 'Filename',
      PYLINT_TYPE = 'Pylint',
      BLACKBOX_TYPE = 'Blackbox';

exports.addTest = function(req, res) {
  const data = req.body;
  var new_test_content;
  if (data.category === FILENAME_TYPE) {
    new_test_content = new FilenameTest(data.content);
  } else if (data.category === PYLINT_TYPE) {
    new_test_content = new PylintTest(data.content);
  } else if (data.category === BLACKBOX_TYPE) {
    new_test_content = new BlackboxTest(data.content);
  } else {
    res.send({ error: 'Unknown test category' });
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
          res.json({ test: { ...test._doc, content: test_content } })
        }
      });
    }
  });
};

exports.getTest = function(req, res) {
  Test.findById(req.params.test_id).lean().exec(function(err, test) {
    if (err) {
      res.send({ error: err });
    } else {
      if (test.category === FILENAME_TYPE) {
        FilenameTest.findById(test.content, function(err, test_content) {
          if (err) {
            res.send({ error: err });
          } else {
            res.json({ test: { ...test, content: test_content } });
          }
        });
      } else if (test.category === PYLINT_TYPE) {
        PylintTest.findById(test.content, function(err, test_content) {
          if (err) {
            res.send({ error: err });
          } else {
            res.json({ test: { ...test, content: test_content } });
          }
        });
      } else if (test.category === BLACKBOX_TYPE) {
        BlackboxTest.findById(test.content, function(err, test_content) {
          if (err) {
            res.send({ error: err });
          } else {
            res.json({ test: { ...test, content: test_content } });
          }
        });
      } else {
        res.send({ error: 'Unknown test category' })
      }
    }
  });
};

exports.updateTest = function(req, res) {
  const data = req.body;
  Test.findByIdAndUpdate(req.params.test_id, { ...data, content: data.content._id }, { new: true }, function(err, test) {
    if (err) {
      res.send({ error: err });
    } else {
      if (test.category === FILENAME_TYPE) {
        FilenameTest.findByIdAndUpdate(test.content, data.content, { new: true }, function(err, test_content) {
          if (err) {
            res.send({ error: err });
          } else {
            res.json({ test: { ...test._doc, content: test_content } });
          }
        });
      } else if (test.category === PYLINT_TYPE) {
        PylintTest.findByIdAndUpdate(test.content, data.content, { new: true }, function(err, test_content) {
          if (err) {
            res.send({ error: err });
          } else {
            res.json({ test: { ...test._doc, content: test_content } });
          }
        });
      } else if (test.category === BLACKBOX_TYPE) {
        BlackboxTest.findByIdAndUpdate(test.content, data.content, { new: true }, function(err, test_content) {
          if (err) {
            res.send({ error: err });
          } else {
            res.json({ test: { ...test._doc, content: test_content } });
          }
        });
      } else {
        res.send({ error: 'Unknown test category' })
      }
    }
  });
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
            if (test.category === FILENAME_TYPE) {
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
            } else if (test.category === PYLINT_TYPE) {
              PylintTest.remove(
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
            } else if (test.category === BLACKBOX_TYPE) {
              BlackboxTest.remove(
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
        }
      );
    }
  });
};
