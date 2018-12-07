const mongoose = require('mongoose'),
      Course = mongoose.model('semester_course'),
      User = mongoose.model('user'),
      Assignment = mongoose.model('assignment'),
      Problem = mongoose.model('problem'),
      Work = mongoose.model('work');

exports.getGrades = function(req, res) {
  const course_id = req.params.course_id
  Course.findById(course_id, function(err, course) {
    if (err) {
      req.send({ error: err })
    } else {
      User.find({
        '_id': { $in: course.students.map(id => mongoose.Types.ObjectId(id)) }
      }).lean().exec(function(err, students) {
        if (err) {
          res.send({ error: err })
        } else {
          var grades = students.reduce((res, student) => {
            res[student.username] = {}
            return res
          }, {})
          students = students.reduce((res, student) => {
            res[student._id] = student
            return res
          }, {})
          Assignment.find({
            '_id': { $in: course.assignments.map(id => mongoose.Types.ObjectId(id)) }
          }).lean().exec(function(err, assignments) {
            if (err) {
              req.send({ error: err })
            } else {
              var problem_ids = []
              var problem_to_assignment = {}
              assignments.forEach(assignment => {
                problem_ids.push(...assignment.problems)
                problem_to_assignment = assignment.problems.reduce((res, problemId) => {
                  res[problemId] = assignment._id
                  return res
                }, problem_to_assignment)
              })
              Problem.find({
                '_id': { $in: problem_ids.map(id => mongoose.Types.ObjectId(id)) }
              }).lean().exec(function(err, problems) {
                if (err) {
                  req.send({ error: err })
                } else {
                  problems = problems.reduce((res, problem) => {
                    res[problem._id] = problem
                    return res
                  }, {})
                  var total_points = {}
                  assignments.forEach(assignment => {
                    total_points[assignment._id] = assignment.problems.reduce(
                      (sum, problem) => sum + problems[problem].total_points,
                      0
                    )
                  })
                  Work.find({
                    'problem': { $in: problem_ids.map(id => mongoose.Types.ObjectId(id)) },
                    'student': { $in: course.students.map(id => mongoose.Types.ObjectId(id)) }
                  }).lean().exec(function(err, works) {
                    if (err) {
                      res.send({ error: err })
                    } else {
                      works.forEach(work => {
                        if (students[work.student] && grades[students[work.student].username] && grades[students[work.student].username][problem_to_assignment[work.problem]]) {
                          grades[students[work.student].username][problem_to_assignment[work.problem]] += work.grade
                        } else if (students[work.student] && grades[students[work.student].username]) {
                          grades[students[work.student].username][problem_to_assignment[work.problem]] = work.grade
                        }
                      })
                      const sorted_assignments = [...assignments].sort((a, b) => a.week_offset - b.week_offset).map(assignment => assignment._id)
                      res.json({ grades, total: total_points, columns: sorted_assignments })
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