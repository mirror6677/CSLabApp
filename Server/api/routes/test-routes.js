'use strict';

const AWS = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const fs = require('fs')
const fse = require('fs-extra')
const shell = require('shelljs')

const mongoose = require('mongoose'),
      PylintTest = mongoose.model('pylint_test')

var credentials = new AWS.SharedIniFileCredentials({ profile: 'labapp' })
AWS.config.credentials = credentials
const s3 = new AWS.S3()

const bucket = 'labapp-uploads'

const upload = is_solution => multer({
  storage: multerS3({
    s3: s3,
    bucket: bucket,
    contentType: (req, file, cb) => {
      cb(null, file.mimetype)
    },
    key: (req, file, cb) => {
      if (is_solution) {
        cb(null, `_solutions/${req.params.test_id}/${file.originalname}`)
      } else {
        cb(null, `_tests/${req.params.test_id}/${file.originalname}`)
      }
    }
  })
})

module.exports = function(app) {
  var tests = require('../controllers/test-controller');  

  app.route('/tests/:test_id')
    .get(tests.getTest)
    .put(tests.updateTest)
    .delete(tests.deleteTest);

  app.route('/tests')
    .post(tests.addTest)

  app.get('/testfiles/solution/:test_id', (req, res) => {
    const params = {
      Bucket: bucket,
      Prefix: `_solutions/${req.params.test_id}`
    }
    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        res.send({ error: err })
      } else {
        res.json({ files: data.Contents })
      }
    })
  })

  app.post('/testfiles/solution/upload/:test_id', upload(true).single('file'), (_, res) => {
    res.json({ result: 'ok' })
  })

  app.get('/testfiles/solution/download/:test_id/:filename', (req, res) => {
    const { test_id, filename } = req.params
    s3.getSignedUrl(
      'getObject', {
        Bucket: bucket,
        Key: `_solutions/${test_id}/${filename}`,
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

  app.get('/testfiles/:test_id', (req, res) => {
    const params = {
      Bucket: bucket,
      Prefix: `_tests/${req.params.test_id}`
    }
    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        res.send({ error: err })
      } else {
        res.json({ files: data.Contents })
      }
    })
  })

  app.post('/testfiles/upload/:test_id', upload(false).single('file'), (_, res) => {
    res.json({ result: 'ok' })
  })

  app.get('/testfiles/download/:test_id/:filename', (req, res) => {
    const { test_id, filename } = req.params
    s3.getSignedUrl(
      'getObject', {
        Bucket: bucket,
        Key: `_tests/${test_id}/${filename}`,
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

  // Running Pylint tests on the server
  app.get('/pylint/:test_id/:work_id', (req, res) => {
    const { test_id, work_id } = req.params
    const params = {
      Bucket: bucket,
      Prefix: `${work_id}`
    }
    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        res.send({ error: err })
      } else {
        fse.ensureDirSync(`temp/${work_id}`)
        data.Contents.forEach(file => {
          const key = file.Key
          var file = fs.createWriteStream(`temp/${key}`)
          s3.getObject({ Bucket: bucket, Key: key }).createReadStream().pipe(file)
        })
        PylintTest.findById(test_id).lean().exec(function(err, test) {
          if (err) {
            res.send({ error: err })
          } else {
            const { flags, filenames } = test
            const command = `pylint ${filenames.map(filename => `temp/${work_id}/${filename}`).join(' ')} ${flags.map(flag => `--${flag}`).join(' ')}`
            shell.exec(command, function(code, stdout, stderr) {
              if (code != 0) {
                res.send({ error: stderr, output: stdout })
              } else {
                res.json({ output: stdout })
              }
            });
          }
        })
      }
    })
  })
}
