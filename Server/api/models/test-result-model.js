'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let TestResultSchema = new Schema({
  test_id: {
    type: Schema.Types.ObjectId,
    required: 'Please enter the test of the result'
  },
  status: {
    type: String,
    required: 'Please enter the status of the result'
  },
  content: {
    type: String,
    default: ''
  }
})

module.exports = mongoose.model('test_result', TestResultSchema);