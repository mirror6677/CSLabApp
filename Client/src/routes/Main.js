import React from 'react'
import { connect } from 'dva'
import { Avatar, Dropdown, Icon, Layout, Menu } from 'antd'
import styles from './Main.css'
import HOME_NAV from '../constants/home_nav'
import PROFILE_DROPDOWN_NAV from '../constants/profile_dropdown_nav'
import StudentFeed from '../pages/studentFeed'
import TAFeed from '../pages/TAFeed'
import CourseEditor from '../pages/courseEditor'

const { Header, Sider, Content } = Layout

class Main extends React.PureComponent {

  componentDidMount() {
    const { id, isSignedIn } = this.props.user
    if (isSignedIn) {
      const courseId = this.props.match.params.courseId
      const action = courseId ? { 
        type: 'course/getCourse', 
        payload: { course: courseId, student: id }
      } : { 
        type: 'course/getActiveCourse',
        payload: { student: id }
      }
      this.props.dispatch(action)
    } else {
      this.props.history.push('/login')
    }
  }

  componentDidUpdate() {
    if (!this.props.user.isSignedIn) {
      this.props.history.push('/login')
    }
  }

  state = {
    collapsed: false,
    nav: HOME_NAV.HOME
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }

  handleNav = e => {
    this.setState({ nav: e.key })
  }

  handleProfileDropdown = e => {
    if (e.key === PROFILE_DROPDOWN_NAV.ADMIN) {
      this.props.history.push('/admin')
    } else if (e.key === PROFILE_DROPDOWN_NAV.LOGOUT) {
      window.gapi.auth2.signOut().then(()=>{
        console.log('signed out!')
        this.props.dispatch({ type: 'user/handleLogout' })
      })
    }
  }

  render() {
    const { user, course } = this.props
    const { id, name, image, isAdmin } = user
    const { collapsed, nav } = this.state

    const menu = (
      <Menu onClick={this.handleProfileDropdown}>
        { isAdmin && <Menu.Item key={PROFILE_DROPDOWN_NAV.ADMIN} className={ styles.profile_menu }>Go to admin app</Menu.Item> }
        { isAdmin && <Menu.Divider /> }
        <Menu.Item key={PROFILE_DROPDOWN_NAV.LOGOUT} className={ styles.profile_menu }><span><Icon type="logout" style={{ marginRight: '15px' }}/>Logout</span></Menu.Item>
      </Menu>
    )

    return (
      <Layout>
        <Sider
          theme='light'
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          <div className={collapsed ? styles.logo_minimized : styles.logo} />
          <Menu mode="inline" onClick={this.handleNav} selectedKeys={[nav]}>
            <Menu.Item key={HOME_NAV.HOME}>
              <Icon type="home" />
              <span>Home</span>
            </Menu.Item>
            <Menu.Item key={HOME_NAV.MESSAGE}>
              <Icon type="message" />
              <span>Messages</span>
            </Menu.Item>
            <Menu.Item key={HOME_NAV.ALERT}>
              <Icon type="notification" />
              <span>Alerts</span>
            </Menu.Item>
            { course._id && (isAdmin || course.TAs.includes(id)) && <Menu.Item key={HOME_NAV.TA}>
              <Icon type="solution" />
              <span>TA View</span>
            </Menu.Item> }
            { isAdmin && <Menu.Item key={HOME_NAV.INSTRUCTOR}>
              <Icon type="edit" />
              <span>Course Editor</span>
            </Menu.Item> }
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className={styles.trigger}
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <Dropdown overlay={menu} className={styles.profile_dropdown} placement='bottomRight'>
              <div>
                <span>{name}</span>
                <Avatar size='large' src={image} style={{ marginLeft: '10px' }} />
              </div>
            </Dropdown>
          </Header>
          <Content className={styles.content}>
            { nav === HOME_NAV.HOME && <StudentFeed /> }
            { nav === HOME_NAV.TA && <TAFeed /> }
            { nav === HOME_NAV.INSTRUCTOR && <CourseEditor /> }
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default connect(({ user, course }) => ({
  user, 
  course
}))(Main)
