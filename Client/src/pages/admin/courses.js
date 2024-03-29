import React from 'react'
import { connect } from 'dva'
import { Card, Col, DatePicker, Icon, Input, Modal, Row, Select, message } from 'antd'
import styles from './courses.css'
import Course from '../../schemas/course'
import RosterModal from '../../components/admin/RosterModal'
import EditModal from '../../components/admin/EditModal'
import moment from 'moment'

const { Meta } = Card
const { Option } = Select

class Courses extends React.PureComponent {
  
  state = {
    showRosterModal: false,
    showEditModal: false,
    tab: 'new',
    showNewCourseModal: false,
    newCourse: new Course(),
    cloneFrom: null,
    rosterCourse: new Course(),
    editCourse: new Course()
  }

  getCourseCard = course => {
    return (
      <Col xs={{ span: 12 }} xl={{ span: 8 }} key={course._id}>
        <Card
          className={styles.card}
          hoverable={true}
          actions={[
            <Icon type='user' onClick={ () => this.openRosterModal(course) } />, 
            <Icon type='edit' onClick={ () => this.openEditModal(course) } />, 
            <Icon type='delete' onClick={ () => this.deleteCourse(course) } />
          ]}
        >
          <Meta
            title={course.semester}
            description={moment(course.start_date).format('MM/DD/YYYY')}
            onClick={() => this.handleCourseNav(course._id)}
            className={styles.card_clickable}
          />
        </Card>
      </Col>
    )
  }

  handleCourseNav = courseId => {
    this.props.dispatch({
      type: 'courses/switchCourse',
      payload: this.onCourseContentCleared(courseId)
    })
  }

  onCourseContentCleared = courseId => {
    return () => this.props.history.push(`/archive/${courseId}`)
  }

  openRosterModal = course => {
    this.setState({
      showRosterModal: true,
      rosterCourse: course
    })
  }

  openEditModal = course => {
    this.setState({
      showEditModal: true,
      editCourse: course
    })
  }

  deleteCourse = course => {

  }

  getNewCourseContent = () => {
    return (
      <DatePicker
        value={this.state.newCourse.start_date}
        placeholder='Start date'
        onChange={ date => this.openNewCourseModal(date) }
      />
    )
  }
  
  openNewCourseModal = newDate => {
    if (!newDate) {
      return
    }
    var newCourse = Object.assign(this.state.newCourse, { start_date: newDate })
    this.setState({
      showNewCourseModal: true,
      newCourse
    })
  }

  getNewCourseModal = visible => {
    const newCourse = this.state.newCourse
    return (
      <Modal
        title={'Add new course'}
        visible={visible}
        onOk={this.submitNewCourse}
        onCancel={ () => this.setState({ showNewCourseModal: false }) }
      >
        <DatePicker
          className={styles.formItem}
          placeholder='Start date'
          value={newCourse.start_date}
          onChange={ date => this.setState({ newCourse: Object.assign({}, newCourse, { start_date: date }) }) }
        />
        <Input 
          className={styles.formItem}
          placeholder="Semester, e.g. Fall 2018" 
          value={newCourse.semester}
          onChange={ e => this.setState({ newCourse: Object.assign({}, newCourse, { semester: e.target.value }) }) } 
        />
      </Modal>
    )
  }

  getCloneCourseModal = visible => {
    const { newCourse, cloneFrom } = this.state
    const courses = this.props.courses
    const sortedCourseIds = Object.keys(courses).sort((a, b) => b.start_date - a.start_date)
    return (
      <Modal
        title={'Clone existing course'}
        visible={visible}
        onOk={this.submitCloneCourse}
        onCancel={ () => this.setState({ showNewCourseModal: false }) }
      >
        <DatePicker
          className={styles.formItem}
          placeholder='Start date'
          value={newCourse.start_date}
          onChange={ date => this.setState({ newCourse: Object.assign({}, newCourse, { start_date: date }) }) }
        />
        <Input 
          className={styles.formItem}
          placeholder="Semester, e.g. Fall 2018" 
          value={newCourse.semester}
          onChange={ e => this.setState({ newCourse: Object.assign({}, newCourse, { semester: e.target.value }) }) } 
        />
        <Select 
          value={cloneFrom} 
          onChange={cloneFrom => this.setState({ cloneFrom })}
          className={styles.formItem} 
          style={{ width: 250 }}
        >
          { sortedCourseIds.map(courseId => (
            <Option value={courseId} key={courseId}>
              {`${courses[courseId].semester} (${moment(courses[courseId].start_date).format('MM/DD/YYYY')})`}
            </Option>
          )) }
        </Select>
      </Modal>
    )
  }

  submitNewCourse = () => {
    const course = this.state.newCourse
    const { semester, start_date } = course
    if (semester && start_date) {
      const newCourse = Object.assign(course, { start_date: course.start_date.toDate() }) 
      this.props.dispatch({
        type: 'courses/addCourse',
        payload: newCourse
      })
      this.setState({
        showNewCourseModal: false,
        newCourse: new Course()
      })
    } else {
      message.error('You must fill out all fields')
    }
  }

  submitCloneCourse = () => {
    const { newCourse, cloneFrom } = this.state
    const { semester, start_date } = newCourse
    if (semester && start_date && cloneFrom) {
      this.props.dispatch({
        type: 'courses/cloneCourse',
        payload: {
          semester,
          start_date: start_date.toDate(),
          cloneFrom
        }
      })
      this.setState({
        showNewCourseModal: false,
        newCourse: new Course(),
        cloneFrom: null
      })
    } else {
      message.error('You must fill out all fields')
    }
  }

  render() {
    const { tab, showNewCourseModal, showRosterModal, rosterCourse, showEditModal, editCourse } = this.state
    const data = Object.keys(this.props.courses).reduce((result, id) => {
      if (this.props.courses[id].deleted === false) {
        result[id] = this.props.courses[id]
      }
      return result
    }, {})

    const tabList = [{
      key: 'new',
      tab: <span style={{ fontSize: 14 }}>New</span>,
    }, {
      key: 'clone',
      tab: <span style={{ fontSize: 14 }}>Clone</span>,
    }]
    
    const contentList = {
      new: this.getNewCourseContent(),
      clone: this.getNewCourseContent()
    }

    return (
      <div className={styles.container}>
        <Row>
          <Col xs={{ span: 12 }} xl={{ span: 8 }} key='new'>
            <Card
              className={styles.card}
              hoverable={true}
              tabList={tabList}
              activeTabKey={tab}
              onTabChange={ key => this.setState({ tab: key }) }
            >
              { contentList[tab] }
            </Card>
          </Col>
          { Object.keys(data).map(id => this.getCourseCard(data[id])) }
        </Row>

        { tab === 'new' ? this.getNewCourseModal(showNewCourseModal) : this.getCloneCourseModal(showNewCourseModal) }
        { showEditModal && <EditModal 
          visible={showEditModal}
          onClose={() => this.setState({ showEditModal: false })}
          course={editCourse}
        /> }
        { showRosterModal && <RosterModal
          visible={showRosterModal}
          onClose={() => this.setState({ showRosterModal: false })}
          course={rosterCourse}
        /> }
      </div>
    )
  }
}

export default connect(({ courses }) => ({
  courses
}))(Courses)