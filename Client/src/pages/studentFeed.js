import React from 'react'
import { connect } from 'dva'
import { Button, Collapse, Tooltip,  message } from 'antd'
import styles from './studentFeed.css'
import moment from 'moment'
import StudentSubmissionModal from '../components/StudentSubmissionModal'

const Panel = Collapse.Panel

class StudentFeed extends React.PureComponent {

  state = {
    showSubmissionModal: false,
    submissionLoading: false,
    currWorkId: null
  }

  getProblemPanel = (assignment, problem) => {
    const { course, works } = this.props
    const { start_date } = course
    const work = Object.keys(works).filter(work => works[work].problem === problem._id)[0]
    var status = ''
    if (work && works[work].submitted) {
      status = 'Submitted.'
    } else if (work) {
      status = `Not submitted.`
    } else {
      status = 'Not started.'
    }
    return (
      <Panel
        header={
          <div>
            {problem.name}
            <div style={{ float: 'right', marginRight: '20px' }}>
              <span>
                {`${status} Due on ${moment(start_date).add({ days: problem.day_offset, weeks: this.props.assignments[assignment].week_offset }).format('MM/DD/YYYY')}`}
              </span>
              <Tooltip title='View/edit submission' placement='topRight'>
                <Button 
                  size='small' 
                  icon='form' 
                  style={{ margin: 'auto', marginLeft: '20px' }} 
                  onClick={e => this.onOpenSubmissionDialog(e, problem, work)} 
                />
              </Tooltip>
            </div>
          </div>
        } 
        key={problem._id} 
        className={styles.problem_panel}
      >
        <div dangerouslySetInnerHTML={{ __html: `${problem.content}` }} />
      </Panel>
    )
  }

  onOpenSubmissionDialog = (e, problem, work) => {
    e.preventDefault()
    e.stopPropagation()
    if (!work) {
      this.props.dispatch({
        type: 'works/addWork',
        payload: {
          data: {
            student: this.props.user.id,
            course: this.props.course._id,
            problem: problem._id,
            last_modified: Date.now()
          },
          callback: this.onNewWorkCreated
        }
      })
    } else {
      this.setState({
        showSubmissionModal: true,
        currWorkId: work
      })
    }
    
  }

  onNewWorkCreated = resp => {
    if (resp.data) {
      this.setState({
        showSubmissionModal: true,
        currWorkId: resp.data
      })
    } else {
      message.error(resp.err)
    }
  }

  onSubmit = () => {
    this.setState({
      submissionLoading: true
    })
    this.props.dispatch({
      type: 'works/updateWork',
      payload: {
        data: { 
          ...this.props.works[this.state.currWorkId], 
          submitted: true, 
          last_modified: Date.now() 
        },
        callback: this.onSubmitComplete
      }
    })
  }

  onSubmitComplete = resp => {
    this.setState({
      submissionLoading: false,
      showSubmissionModal: false,
      currWorkId: null
    })
    if (resp.data) {
      message.success('You work has been submitted successfully')
    } else {
      message.error(resp.err)
    }
  }

  onClose = () => {
    this.setState({
      showSubmissionModal: false,
      currWorkId: null
    })
  }
  
  render() {
    const { problems, assignments } = this.props
    const { showSubmissionModal, currWorkId } = this.state
    const sortedAssignments = Object.keys(assignments).sort((a, b) => assignments[a].week_offset - assignments[b].week_offset)

    return (
      <div>
        { sortedAssignments.length && <Collapse 
          bordered={false} 
          defaultActiveKey={[sortedAssignments[0]]} 
          className={styles.container}
        >
          { sortedAssignments.map(assignment => (
            assignments[assignment].problems.length && <Panel 
              header={`${assignments[assignment].name}: ${assignments[assignment].description}`} 
              key={assignment} 
              className={styles.assignment_panel}
            >
              <Collapse bordered={false}>
                { Object.keys(problems).length && 
                  assignments[assignment].problems
                  .sort((a, b) => problems[a].day_offset - problems[b].day_offset)
                  .map(problem => this.getProblemPanel(assignment, problems[problem])) }
              </Collapse>
            </Panel>
          )) }
        </Collapse> }
          { showSubmissionModal && <StudentSubmissionModal 
            visible={showSubmissionModal} 
            workId={currWorkId} 
            onSubmit={this.onSubmit} 
            onClose={this.onClose} 
          /> }
      </div>
    )
  }
}

export default connect(({ user, course, assignments, problems, works }) => ({
  user,
  course,
  assignments,
  problems,
  works
}))(StudentFeed)