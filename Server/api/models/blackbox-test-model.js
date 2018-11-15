'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let BlackboxTestSchema = new Schema({
  command: {
    type: String,
    required: 'Please enter the command you want to run'
  },
  expected_output: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model('blackbox_test', BlackboxTestSchema);
