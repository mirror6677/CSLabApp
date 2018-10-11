'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let SemesterCourseSchema = new Schema(
  {
    semester: {
      type: String,
      required: 'Please enter the semester of the course'
    },
    start_date: {
      type: Date,
      required: 'Please enter the start date of the course'
    },
    professors: {
      type: [Schema.Types.ObjectId],
      ref: 'user',
      default: []
    },
    TAs: {
      type: [Schema.Types.ObjectId],
      ref: 'user',
      default: []
    },
    students: {
      type: [Schema.Types.ObjectId],
      ref: 'user',
      default: []
    },
    assignments: {
      type: [Schema.Types.ObjectId],
      ref: 'assignment',
      default: []
    },
    active: {
      type: Boolean,
      default: false
    },
    deleted: {
      type: Boolean,
      default: false
    }
  }
);

module.exports = mongoose.model('semester_course', SemesterCourseSchema);
