'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let UserSchema = new Schema(
  {
    username: {
      type: String,
      required: 'Please enter the username of the user',
      unique: true
    },
    admin: {
      type: Boolean,
      default: false
    }
  }
);

module.exports = mongoose.model('user', UserSchema);
