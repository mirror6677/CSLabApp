const passport = require('passport'),
      GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
      OAuth2Client = require('google-auth-library').OAuth2Client,
      google_client_config = require('../../credentials/google_client_config');

passport.serializeUser(function(user, done) {
  done(null, user);
 });
passport.deserializeUser(function(user, done) {
  done(null, user);
 });

passport.use(new GoogleStrategy({
  clientID: google_client_config.CLIENT_ID,
  clientSecret: google_client_config.CLIENT_SECRET,
  callbackURL: "http://localhost:8000/auth/callback"
},
function(accessToken, _, profile, done) {
  var userData = {
    username: profile.emails[0].value.split("@")[0],
    token: accessToken
  };
  done(null, userData);
}));

const client = new OAuth2Client(google_client_config.CLIENT_ID);

module.exports = function(app) {
  async function verify(token) {
    let vparams = {
      idToken: token,
      audience: google_client_config.CLIENT_ID
    }
    const ticket = await client.verifyIdToken(vparams);
    const payload = ticket.getPayload();
    return payload
  }
  
  app.post('/logout', (req, res) =>{
    // log out the current session.
    req.session.destroy()
    res.json({result:'ok'})
  })
  
  app.post('/login', (req, res) =>{
    // https://developers.google.com/identity/sign-in/web/backend-auth
    // react app handles the login and posts the token here.
    if ('token' in req.body){
      console.log("got login request, checking token...")
  
      // have to verify the token before using
      verify(req.body.token)
        .then(profile => {
          console.log("verified sub=", profile.sub,
            'name=', profile.name,
            'email=', profile.email,
            'domain=', profile.hd)
  
          // make some session counters (just examples)
          if (!req.session.loginCount){
            req.session.loginCount = 1
          } else {
            req.session.loginCount += 1
          }
          req.session.profile = profile
          req.session.lastAccess = new Date()

          res.json({ result:'ok' })
        })
        .catch((err)=>{
          console.log(err)
          res.json({ result: 'error', error: err })
        })
    } else {
      res.json({ result: 'error' })
    }
  })
  
  app.get('/', (req, res)=>{
    // get on the root just returns a copy of the sesson data
    // to demonstrate how sessions work
  
    // update session counters
    if (!req.session.rootCount){
      req.session.rootCount = 1
    }else{
      req.session.rootCount += 1
    }
    req.session.lastAccess = new Date()
    res.json({
      'result':'ok',
      'session': req.session
    })
  })
}
