'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let ProblemSchema = new Schema({
  name: {
    type: String,
    required: 'Please enter the name of the problem'
  },
  day_offset: {
    type: Number,
    default: 0
  },
  total_points: {
    type: Number,
    default: 0
  },
  content: {
    type: String,
    default: ""
  },
  tests: {
    type: [Schema.Types.ObjectId],
    default: []
  }
});

module.exports = mongoose.model('problem', ProblemSchema);
