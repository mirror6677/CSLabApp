import React from 'react'
import { connect } from 'dva'
import { Avatar, Icon, Layout, Menu } from 'antd'
import styles from './Main.css'
import HOME_NAV from '../constants/home_nav'

const { Header, Sider, Content } = Layout

class Main extends React.PureComponent {

  componentDidMount() {
    if (this.props.user.isSignedIn) {
      this.props.dispatch({ type: 'courses/getCourse' })
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

  render() {
    const { name, image } = this.props.user
    const { collapsed, nav } = this.state

    return (
      <Layout>
        <Sider
          theme='light'
          trigger={null}
          collapsible
          collapsed={collapsed}
          position='fixed'
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
            <Menu.Item key={HOME_NAV.TA}>
              <Icon type="solution" />
              <span>TA View</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className={styles.trigger}
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <Avatar size='large' src={image} style={{ float: 'right', marginTop: '15px', marginRight: '20px', marginLeft: '10px' }} />
            <span style={{ float: 'right' }}>{name}</span>
          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
            Content
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default connect(({ user, courses }) => ({
  user, 
  courses
}))(Main)
