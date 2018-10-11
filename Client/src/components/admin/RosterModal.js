import React from 'react'
import { connect } from 'dva'
import { Avatar, Icon, Input, List, Modal, Spin } from 'antd'
import styles from './RosterModal.css'
import InfiniteScroll from 'react-infinite-scroller'
import getUserImageUrl from '../../utils/imageUrl'

class RosterModal extends React.PureComponent {

  state = {
    newRoster: { students: [], TAs: [], professors: [] },
    objectIds: [],
    roleDict: {},
    numLoaded: 0,
    loading: false,
    hasMore: true,
  }

  componentDidMount() {
    const { students, TAs, professors } = this.props.course
    const objectIds = professors.concat(TAs.concat(students))
    var roleDict = {}
    students.forEach(id => {
      roleDict[id] = 'Student'
    })
    TAs.forEach(id => {
      roleDict[id] = 'TA'
    })
    professors.forEach(id => {
      roleDict[id] = 'Professor'
    })
    this.setState({ objectIds, roleDict })
  }

  componentDidUpdate(_, prevState) {
    const { numLoaded } = prevState
    this.setState({
      loading: false,
      numLoaded: numLoaded + 10
    })
  }

  handleInfiniteOnLoad = () => {
    this.setState({
      loading: true
    })
    const { numLoaded, objectIds } = this.state
    if (numLoaded >= objectIds.length) {
      this.setState({
        hasMore: false,
        loading: false
      })
    } else {
      this.props.dispatch({ type: 'roster/loadRoster', payload: objectIds.slice(numLoaded, numLoaded+10) })
    }
  }

  onUpdate = newRoster => {
    this.setState({ newRoster })
  }

  onSubmit = () => {
    this.props.dispatch({
      type: 'roster/updateCourseRoster',
      payload: {
        ...this.state.newRoster,
        course: this.props.course
      }
    })
    this.props.onClose()
  }

  deleteUser = id => {
    const { roleDict } = this.state
    const { course } = this.props
    var updatedCourse = Object.assign({}, course)
    if (roleDict[id] === 'Professor') {
      updatedCourse.professors = updatedCourse.professors.filter(el => el !== id)
    } else if (roleDict[id] === 'TA') {
      updatedCourse.TAs = updatedCourse.TAs.filter(el => el !== id)
    } else {
      updatedCourse.students = updatedCourse.students.filter(el => el !== id)
    }
    this.props.dispatch({ type: 'roster/deleteUserFromRoster', payload: updatedCourse })
    this.setState({
      objectIds: this.state.objectIds.filter(el => el !== id)
    })
  }
  
  render() {
    const { newRoster, objectIds, roleDict, numLoaded, loading, hasMore } = this.state
    const { visible, onClose, roster } = this.props
    const { students, TAs, professors } = newRoster
    return (
      <Modal
        title={'Class roster'}
        visible={visible}
        onOk={this.onSubmit}
        onCancel={onClose}
        width={'70%'}
      >
        <p>Current participants:</p>
        <InfiniteScroll
          initialLoad={true}
          loadMore={this.handleInfiniteOnLoad}
          hasMore={!loading && hasMore}
          useWindow={false}
          className={styles.rosterList}
        >
          <List
            dataSource={objectIds.slice(0, numLoaded)}
            renderItem={ item => roster[item] ? (
              <List.Item 
                key={item} 
                actions={[<Icon type='delete' onClick={() => this.deleteUser(item)} />]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={getUserImageUrl(roster[item].username)} />}
                  title={roster[item].name}
                  description={`${roster[item].username}@bucknell.edu`}
                />
                <div>{roleDict[item]}</div>
              </List.Item>
            ) : <div/> }
          >
            {loading && hasMore && (
              <div className="demo-loading-container">
                <Spin />
              </div>
            )}
          </List>
        </InfiniteScroll>

        <p>Add new participants (usernames separated by comma):</p>
        <Input 
          className={styles.formItem}
          placeholder="Professors" 
          value={ professors.join(',') }
          onChange={ e => this.onUpdate(Object.assign({}, newRoster, { professors: e.target.value.split(',') })) } 
        />
        <Input 
          className={styles.formItem}
          placeholder="TAs" 
          value={ TAs.join(',') }
          onChange={ e => this.onUpdate(Object.assign({}, newRoster, { TAs: e.target.value.split(',') })) } 
        />
        <Input 
          className={styles.formItem}
          placeholder="Students" 
          value={ students.join(',') }
          onChange={ e => this.onUpdate(Object.assign({}, newRoster, { students: e.target.value.split(',') })) } 
        />
      </Modal>
    )
  }
}

export default connect(({ roster }) => ({
  roster
}))(RosterModal)