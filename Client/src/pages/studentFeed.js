import React from 'react'
import { connect } from 'dva'

class StudentFeed extends React.PureComponent {
  
  render() {
    return (
      <div>To be implemented</div>
    )
  }
}

export default connect(({ courses }) => ({
  courses
}))(StudentFeed)