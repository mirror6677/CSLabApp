import React from 'react'
import { connect } from 'dva'
import styles from './Login.css'
import logo from '../assets/CompSciLogo.png'

class Login extends React.PureComponent {

  componentDidMount() {
    this.props.dispatch({ type: 'user/verifyUser' })
    this.drawsignin()
  }

  componentDidUpdate() {
    if (this.props.user.isSignedIn) {
      this.props.history.push('/')
    }
  }

  drawsignin = () => {
    window.gapi.signin2.render('signin-button', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': this.handleLogin,
      'onfailure': error => console.log(error)
    })
  }

  handleLogin = gUser => {
    let token = gUser.getAuthResponse().id_token
    this.props.dispatch({ type: 'user/handleLogin', payload: token })
  }

  render() {
    return (
      <div className={styles.container}>
        <img className={styles.logo} src={logo} alt='Computer Science' />
        <div id='signin-button' style={{ margin: 'auto', width: '240px' }}/>
      </div>
    )
  }
}

export default connect(({ user }) => ({
  user,
}))(Login)
