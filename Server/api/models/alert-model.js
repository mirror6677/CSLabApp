'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let AlertSchema = new Schema({
  category: {
    type: String,
    required: 'Please enter the category of the alert'
  },
  message: {
    type: String,
    default: ''
  },
  entity: {
    type: Schema.Types.ObjectId,
    required: 'Please enter the entity of the alert'
  },
  user: {
    type: Schema.Types.ObjectId,
    required: 'Please enter the user(receiver) of the alert'
  },
  read: {
    type: Boolean,
    default: false
  },
  date_created: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('alert', AlertSchema);
