const express = require('express'),
      app = express(),
      port = process.env.PORT || 8000,
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      passport = require('passport'),
      db_config = require('./credentials/db_config'),
      session = require('express-session'),
      MongoDBStore = require('connect-mongodb-session')(session),
      morgan = require('morgan');

// Registering schemas
require('./api/models/course-model');
require('./api/models/assignment-model');
require('./api/models/problem-model');
require('./api/models/user-model');
require('./api/models/work-model');
require('./api/models/test-model');
require('./api/models/filename-test-model');
require('./api/models/pylint-test-model');
require('./api/models/blackbox-test-model');
require('./api/models/test-result-model');
require('./api/models/alert-model');

/*
// For clearing all content
const Course = mongoose.model('semester_course');
const User = mongoose.model('user');
const Assignment = mongoose.model('assignment');
const Problem = mongoose.model('problem');
const Work = mongoose.model('work');

Course.remove({}, function(err) {
  console.log('course removed')
});

User.remove({}, function(err) {
  console.log('user removed')
  var admin = new User({
    username: 'jw057',
    admin: true
  });
  admin.save(function(err, user) {
    if (err)
      console.error(err)
    console.log('Admin user added', user)
  });
  var admin2 = new User({
    username: 'amm042',
    admin: true
  })
  admin2.save(function(err, user) {
    if (err)
      console.error(err)
    console.log('Admin user added', user)
  });
});

Assignment.remove({}, function(err) {
  console.log('assignment removed')
});

Problem.remove({}, function(err) {
  console.log('problem removed')
});

Work.remove({}, function(err) {
  console.log('work removed')
});
*/

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(
  `mongodb://${db_config.USERNAME}:${db_config.PASSWORD}@${db_config.DATABASE}`,
  err => { if (err) throw err; }
);

var store = new MongoDBStore(
  {
    uri: `mongodb://${db_config.USERNAME}:${db_config.PASSWORD}@${db_config.DATABASE}`,
    collection: 'auth-session'
  });

// Catch errors
store.on('error', function(error) {
  assert.ifError(error);
  assert.ok(false);
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://www.eg.bucknell.edu:"+port);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000")
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE")
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(morgan('combined'));

app.use(session({
  secret: 'This is a secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  resave: true,
  saveUninitialized: true
}));

var routes = require('./api/routes/routes'); //importing route
routes(app); //register the route

app.listen(port);

console.log('LabApp RESTful API server started on: ' + port);
