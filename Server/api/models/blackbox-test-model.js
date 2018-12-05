'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let BlackboxTestSchema = new Schema({
  command: {
    type: String,
    default: ''
  },
  solution_included: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('blackbox_test', BlackboxTestSchema);
