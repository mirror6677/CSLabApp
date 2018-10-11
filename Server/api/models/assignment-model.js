'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let AssignmentSchema = new Schema({
  name: {
    type: String,
    required: 'Please enter the name of the assignment'
  },
  description: {
    type: String,
    default: ""
  },
  week_offset: {
    type: Number,
    required: 'Please enter the week offset of the assignment'
  },
  problems: {
    type: [Schema.Types.ObjectId],
    ref: 'problem',
    default: []
  }
});

module.exports = mongoose.model('assignment', AssignmentSchema);
