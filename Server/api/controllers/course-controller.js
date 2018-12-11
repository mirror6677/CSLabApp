const mongoose = require('mongoose'),
      Course = mongoose.model('semester_course'),
      Assignment = mongoose.model('assignment'),
      Problem = mongoose.model('problem'),
      Test = mongoose.model('test'),
      FilenameTest = mongoose.model('filename_test'),
      PylintTest = mongoose.model('pylint_test'),
      BlackboxTest = mongoose.model('blackbox_test');

const FILENAME_TYPE = 'Filename',
      PYLINT_TYPE = 'Pylint',
      BLACKBOX_TYPE = 'Blackbox';

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

exports.cloneCourse = function(req, res) {
  Course.findById(req.params.course_id, function(err, course) {
    if (err) {
      res.send({ error: err })
    } else {
      Assignment.find({
        '_id': { $in: course.assignments.map(id => mongoose.Types.ObjectId(id)) }
      }).lean().exec(function(err, assignments) {
        if (err) {
          res.send({ error: err })
        } else {
          var problemIds = []
          assignments.forEach(assignment => {
            problemIds.push(...assignment.problems)
          })
          Problem.find({
            '_id': { $in: problemIds.map(id => mongoose.Types.ObjectId(id)) }
          }).lean().exec(function(err, problems) {
            if (err) {
              res.send({ error: err })
            } else {
              var testIds = []
              problems.forEach(problem => {
                testIds.push(...problem.tests)
              })
              Test.find({
                '_id': { $in: testIds.map(id => mongoose.Types.ObjectId(id)) }
              }).lean().exec(function(err, tests) {
                if (err) {
                  res.send({ error: err })
                } else {
                  var filenameIds = []
                  var pylintIds = []
                  var blackboxIds = []
                  tests.forEach(test => {
                    if (test.category === FILENAME_TYPE) {
                      filenameIds.push(test.content)
                    } else if (test.category === PYLINT_TYPE) {
                      pylintIds.push(test.content)
                    } else if (test.category === BLACKBOX_TYPE) {
                      blackboxIds.push(test.content)
                    }
                  })
                  FilenameTest.find({
                    '_id': { $in: filenameIds.map(id => mongoose.Types.ObjectId(id)) }
                  }).lean().exec(function(err, filenameTests) {
                    if (err) {
                      res.send({ error: err })
                    } else {
                      PylintTest.find({
                        '_id': { $in: pylintIds.map(id => mongoose.Types.ObjectId(id)) }
                      }).lean().exec(function(err, pylintTests) {
                        if (err) {
                          res.send({ error: err })
                        } else {
                          BlackboxTest.find({
                            '_id': { $in: blackboxIds.map(id => mongoose.Types.ObjectId(id)) }
                          }).lean().exec(function(err, blackboxTests) {
                            if (err) {
                              res.send({ error: err })
                            } else {
                              // Copy filename tests
                              FilenameTest.insertMany(
                                filenameTests.map(({ _id, ...data }) => data), 
                                function(err, newFilenameTests) {
                                  if (err) {
                                    res.send({ error: 'Filename test copy failed' })
                                  } else {
                                    var filenameTestsPair = {}
                                    newFilenameTests.forEach((el, index) => {
                                      filenameTestsPair[filenameTests[index]._id] = el._id
                                    })
                                    // Copy pylint tests
                                    PylintTest.insertMany(
                                      pylintTests.map(({ _id, ...data }) => data),
                                      function(err, newPylintTests) {
                                        if (err) {
                                          res.send({ error: 'Pylint test copy failed' })
                                        } else {
                                          var pylintTestsPair = {}
                                          newPylintTests.forEach((el, index) => {
                                            pylintTestsPair[pylintTests[index]._id] = el._id
                                          })
                                          // Copy blackbox tests
                                          BlackboxTest.insertMany(
                                            blackboxTests.map(({ _id, ...data }) => data),
                                            function(err, newBlackboxTests) {
                                              if (err) {
                                                res.send({ error: 'Blackbox test copy failed' })
                                              } else {
                                                var blackboxTestsPair = {}
                                                newBlackboxTests.forEach((el, index) => {
                                                  blackboxTestsPair[blackboxTests[index]._id] = el._id
                                                })
                                                // Copy tests
                                                Test.insertMany(
                                                  tests.map(({ _id, category, content, ...data }) => {
                                                    var newContent
                                                    if (category === FILENAME_TYPE) {
                                                      newContent = filenameTestsPair[content]
                                                    } else if (category === PYLINT_TYPE) {
                                                      newContent = pylintTestsPair[content]
                                                    } else if (category === BLACKBOX_TYPE) {
                                                      newContent = blackboxTestsPair[content]
                                                    }
                                                    return { ...data, category, content: newContent }
                                                  }), function(err, newTests) {
                                                    if (err) {
                                                      res.send({ error: err })
                                                    } else {
                                                      var testsPair = {}
                                                      newTests.forEach((el, index) => {
                                                        testsPair[tests[index]._id] = el._id
                                                      })
                                                      // Copy problems
                                                      Problem.insertMany(
                                                        problems.map(({ _id, tests, ...data }) => ({
                                                          ...data,
                                                          tests: tests.map(t => testsPair[t])
                                                        })), function(err, newProblems) {
                                                          if (err) {
                                                            res.send({ error: err })
                                                          } else {
                                                            var problemsPair = {}
                                                            newProblems.forEach((el, index) => {
                                                              problemsPair[problems[index]._id] = el._id
                                                            })
                                                            // Copy assignments
                                                            Assignment.insertMany(
                                                              assignments.map(({ _id, problems, ...data }) => ({
                                                                ...data,
                                                                problems: problems.map(p => problemsPair[p])
                                                              })), function(err, newAssignments) {
                                                                if (err) {
                                                                  return { error: err }
                                                                } else {
                                                                  const assignmentIds = newAssignments.map(a => a._id)
                                                                  var newCourse = new Course({
                                                                    ...req.body,
                                                                    assignments: assignmentIds
                                                                  })
                                                                  newCourse.save(function(err, newCourse) {
                                                                    if (err) {
                                                                      res.send({ error: err })
                                                                    } else {
                                                                      res.json({ course: newCourse })
                                                                    }
                                                                  })
                                                                }
                                                              }
                                                            )
                                                          }
                                                        }
                                                      )
                                                    }
                                                  }
                                                )
                                              }
                                            }
                                          )
                                        }
                                      }
                                    )
                                  }
                                }
                              )
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  })
}

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
