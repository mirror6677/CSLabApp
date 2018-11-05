import React from 'react'
import { Router, Route, Switch } from 'dva/router'
import Main from './routes/Main'
import Login from './routes/Login'
import Admin from './routes/Admin'
import CLIENT_ID from '../credentials/google_client_config'

function RouterConfig({ history }) {
  // this loads the google api object
  window.gapi.load('auth2', () => {
    window.gapi.auth2.init({
      client_id: CLIENT_ID,
      fetch_basic_profile: true
    }).then(auth2 => {
      window.gapi.auth2 = auth2
    }).catch(reason => {
      console.log('auth2.init failed with: ' + reason.error)
      console.log(reason.details)
    })
  })

  return (
    <Router history={history}>
      <Switch>
        <Route path='/' exact component={Main} />
        <Route path='/login' exact component={Login} />
        <Route path='/admin' exact component={Admin} />
        <Route path='/archive/:courseId' component={Main} />
      </Switch>
    </Router>
  );
}

export default RouterConfig
