'use strict';

const AWS = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

// create the file ~/.aws/credentials change the [profile] to match your app
// [labapp]
// aws_access_key_id = ...
// aws_secret_access_key = ...
var credentials = new AWS.SharedIniFileCredentials({profile: 'labapp'})
AWS.config.credentials = credentials
const s3 = new AWS.S3()

// specify your bucket name here
const bucket = 'labapp-uploads'

// this generates the key (filename) from the originalname
// keys have to be unique, so in the future pass in username and
// use path-like names like username+'/'+originalname
// upload of a duplicate keys will overwrite the old contents
var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucket,
    key: (req,file,cb) => {
      cb(null, file.originalname)
    }
  })
 })

module.exports = function(app) {
  app.post('/files/upload', upload.single('file'), (req,res) => {
    console.log(req)
    // multer-s3 does the magic of uploading to s3 given the configuration
    // at the top of this program.
    // https://www.npmjs.com/package/multer-s3
    console.log('uploaded', req.files.length, 'files to s3')

    res.json({result: "ok"})
  });
};