'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let TestSchema = new Schema({
  name: {
    type: String,
    required: 'Please enter the name of the test'
  },
  category: {
    type: String,
    required: 'Please enter the category of the test'
  },
  ta_only: {
    type: Boolean,
    default: false
  },
  content: {
    type: Schema.Types.ObjectId,
    required: 'Please enter the content of the test'
  }
});

module.exports = mongoose.model('test', TestSchema);
