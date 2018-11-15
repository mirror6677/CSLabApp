'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let PylintTestSchema = new Schema({
  filename: {
    type: String,
    required: 'Please enter the filename of the pylint test'
  },
  flags: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model('pylint_test', PylintTestSchema);
