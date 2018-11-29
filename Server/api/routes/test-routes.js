'use strict';

const AWS = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const fse = require('fs-extra')

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
        cb(null, `_tests/${req.params.test_id}/solution/${file.originalname}`)
      } else {
        cb(null, `_tests/${req.params.test_id}/${file.originalname}`)
      }
    }
  })
})

const temp_upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = `~/labapp_uploads/${req.params.directory}`
      fse.ensureDir(dir).then(() => {
        cb(null, dir)
      }).catch(err => {
        console.error(err)
      })
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
})

module.exports = function(app) {
  var tests = require('../controllers/test-controller');  

  app.route('/tests/:test_id')
    .get(tests.getTest)
    .post(tests.addTest)
    .put(tests.updateTest)
    .delete(tests.deleteTest);

  app.route('/tests/:type/:test_content_id')
    .put(tests.updateTestContent)

  app.post('/testfiles/tempuploads/:directory', temp_upload.single('file'), (_, res) => {
    res.json({ result: 'ok' })
  })

  app.get('testfiles/solution/:test_id', (req, res) => {
    const params = {
      Bucket: bucket,
      Prefix: `_tests/${req.params.test_id}/solution`
    }
    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        res.send({ error: err })
      } else {
        res.json({ files: data.Contents })
      }
    })
  })

  app.post('testfiles/solution/upload/:test_id', upload(true).single('file'), (_, res) => {
    res.json({ result: 'ok' })
  })

  app.get('testfiles/:test_id', (req, res) => {
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

  app.post('testfiles/upload/:test_id', upload(false).single('file'), (_, res) => {
    res.json({ result: 'ok' })
  })
}
