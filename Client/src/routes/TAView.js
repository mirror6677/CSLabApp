import React from 'react'
import { connect } from 'dva'

class TAView extends React.PureComponent {

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

  render() {
    return (
      <div/>
    )
  }
}

export default connect(({ user }) => ({
  user,
}))(TAView)
