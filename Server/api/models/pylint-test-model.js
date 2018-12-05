'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let PylintTestSchema = new Schema({
  filenames: {
    type: [String],
    default: []
  },
  flags: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model('pylint_test', PylintTestSchema);
