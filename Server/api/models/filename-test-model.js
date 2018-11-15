'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let FilenameTestSchema = new Schema({
  filenames: {
    type: [String],
    required: 'Please enter the expected filenames'
  }
});

module.exports = mongoose.model('filename_test', FilenameTestSchema);
