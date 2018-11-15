'use strict'

const AWS = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

// create the file ~/.aws/credentials change the [profile] to match your app
// [labapp]
// aws_access_key_id = ...
// aws_secret_access_key = ...
var credentials = new AWS.SharedIniFileCredentials({ profile: 'labapp' })
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
    contentType: (req, file, cb) => {
      cb(null, file.mimetype)
    },
    key: (req, file, cb) => {
      cb(null, `${req.params.work_id}/${file.originalname}`)
    }
  })
 })

module.exports = function(app) {
  app.get('/files', (_, res) => {
    s3.listObjectsV2({ Bucket: bucket }, (err, data) => {
      if (err) {
        res.send({ error: err })
      } else {
        res.json(data)
      }
    })
  })

  app.get('/files/:work_id', (req, res) => {
    const params = {
      Bucket: bucket,
      Prefix: req.params.work_id
    }
    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        res.send({ error: err })
      } else {
        res.json({ files: data.Contents })
      }
    })
  })

  app.get('/files/:work_id/:filename', (req, res) => {
    console.log(req.params)
    const { work_id, filename } = req.params
    const params = {
      Bucket: bucket,
      Key: `${work_id}/${filename}`
    }
    s3.getObject(params, (err, data) => {
      if (err) {
        res.send({ error: err })
      } else {
        res.json({ file: data })
      }
    })
  })

  app.get('/files/download/:work_id/:filename', (req, res) => {
    const { work_id, filename } = req.params
    s3.getSignedUrl(
      'getObject', {
        Bucket: bucket,
        Key: `${work_id}/${filename}`,
        Expires: 120
      }, (err, data) => {
        if (err) {
          res.send({ error: err })
        } else {
          res.redirect(data)
        }
      }
    )
  })

  app.post('/files/upload/:work_id', upload.single('file'), (req, res) => {
    res.json({ result: 'ok' })
  })

  app.post('/files/remove/:work_id/:filename', (req, res) => {
    const { work_id, filename } = req.params
    const params = {
      Bucket: bucket,
      Key: `${work_id}/${filename}`
    }
    s3.deleteObject(params, (err, data) => {
      if (err) {
        res.send({ error: err })
      } else {
        res.json(data)
      }
    })
  })
}