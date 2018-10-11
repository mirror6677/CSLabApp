import React from 'react'
import { connect } from 'dva'
import { Avatar, Icon, Menu } from 'antd'
import styles from './Admin.css'
import logo from '../assets/CompSciLogo.png'
import ADMIN_NAV from '../constants/admin_nav'
import Courses from '../pages/admin/courses'
import Stats from '../pages/admin/stats'
import Settings from '../pages/admin/settings'

const SubMenu = Menu.SubMenu;

class Main extends React.Component {

  state = {
    nav: ADMIN_NAV.COURSES
  }

  componentDidMount() {
    if (this.props.user.isSignedIn) {
      this.props.dispatch({ type: 'courses/getAll' })
    } else {
      this.props.history.push('/login')
    }
  }

  componentDidUpdate() {
    if (!this.props.user.isSignedIn) {
      this.props.history.push('/login')
    }
  }

  handleNav = e => {
    var nav = e.key
    if (nav === ADMIN_NAV.HOME) {
      nav = ADMIN_NAV.COURSES
    } else if (nav === ADMIN_NAV.LOGOUT) {
      this.handleLogout()
    }
    this.setState({ nav })
  }

  /*
  logout = () => {
    window.location = 'http://localhost:8000/auth/logout'
  }
  */

  handleLogout = () => {
    window.gapi.auth2.signOut().then(()=>{
      console.log('signed out!')
      this.props.dispatch({ type: 'user/handleLogout' })
    })
  }

  onAddCourse = course => {
    const { name, full_name, semester, start_date } = course
    if (name && full_name && semester && start_date) {
      course.start_date = course.start_date.toDate()
      
      this.props.dispatch({
        type: 'courses/addCourse',
        payload: course
      })
    }
  }

  render() {
    const { name, image } = this.props.user
    const { nav } = this.state

    return (
      <div>
        <Menu
          className={styles.menu}
          mode='horizontal'
          onClick={this.handleNav}
          selectedKeys={[nav]}
        >
          <Menu.Item key={ADMIN_NAV.HOME} className={styles.logoMenu}>
            <img className={styles.logo} src={logo} alt='Computer Science' />
          </Menu.Item>
          <Menu.Item key={ADMIN_NAV.COURSES}>Courses</Menu.Item>
          <Menu.Item key={ADMIN_NAV.STATS}>Statistics</Menu.Item>
          <Menu.Item key={ADMIN_NAV.SETTINGS}>Settings</Menu.Item>
          <SubMenu 
            title={ 
              <div>
                <span className={styles.profileName}>{name}</span>
                <Avatar size='large' src={image} /> 
              </div>
            }
            className={styles.profileMenu}>
            <Menu.Item key={ADMIN_NAV.LOGOUT} className={styles.logoutMenu}>
              <span><Icon type="logout"/>Logout</span>
            </Menu.Item>
          </SubMenu>
        </Menu>
        {nav === ADMIN_NAV.COURSES && <Courses />}
        {nav === ADMIN_NAV.STATS && <Stats />}
        {nav === ADMIN_NAV.SETTINGS && <Settings />}
      </div>
    )
  }
  
}

export default connect(({ user, courses }) => ({
  user,
  courses
}))(Main)