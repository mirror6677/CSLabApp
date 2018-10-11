'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let WorkSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    required: 'Please enter the student of this work'
  },
  problem: {
    type: Schema.Types.ObjectId,
    required: 'Please enter the problem of this work'
  },
  last_modified: {
    type: Date,
    required: 'Please enter the last modified time of this work'
  },
  files: {
    type: [String],
    default: []
  },
  grade: {
    type: Number,
    default: 0
  },
  submitted: {
    type: Boolean,
    default: false
  },
  graded: {
    type: Boolean,
    default: false
  },
  graded_by: {
    type: [Schema.Types.ObjectId],
    default: []
  },
  comments: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model('work', WorkSchema);