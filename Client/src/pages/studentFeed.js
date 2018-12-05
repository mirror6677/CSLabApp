import React from 'react'
import { connect } from 'dva'
import { Button, Collapse, Popconfirm, Tooltip,  message } from 'antd'
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

  /**
   * Returns the collapsable panel for each problem given the assignment ID and the problem object.
   */
  getProblemPanel = (assignment, problem) => {
    const { course, works } = this.props
    const { start_date } = course
    const work = Object.keys(works).filter(work => works[work].problem === problem._id)[0]
    var status = ''
    if (work && works[work].graded) {
      status = 'Graded.'
    } else if (work && works[work].submitted) {
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
                { work && works[work].submitted ?
                  <Popconfirm
                    placement='leftTop' 
                    title={'This will unsubmit your work, do you wish to continue?'} 
                    onConfirm={ e => this.unsubmitWork(e, work) } 
                    onCancel={ e => e.stopPropagation() }
                    okText='Yes' 
                    cancelText='No'
                  >
                    <Button 
                      size='small' 
                      icon='form' 
                      style={{ margin: 'auto', marginLeft: '20px' }}
                      onClick={ e => this.onOpenSubmissionDialog(e, problem, work) } 
                    />
                  </Popconfirm> :
                  <Button 
                    size='small' 
                    icon='form' 
                    style={{ margin: 'auto', marginLeft: '20px' }} 
                    onClick={ e => this.onOpenSubmissionDialog(e, problem, work) } 
                  />
                }
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

  /**
   * Called when the edit submission button is clicked, takes in a problem object and a work ID.
   * Create a new work for the problem if one does not exist.
   * If work is already submitted, user will need to confirm unsubmit.
   */
  onOpenSubmissionDialog = (e, problem, work) => {
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
    } else if (!this.props.works[work].submitted) {
      this.openSubmissionDialog(work)
    }
  }

  /**
   * Set the state to reflect opened submission modal.
   */
  openSubmissionDialog = workId => {
    this.setState({
      showSubmissionModal: true,
      currWorkId: workId
    })
  }

  /**
   * Callback function called after a new work is created.
   */
  onNewWorkCreated = resp => {
    if (resp.data) {
      this.openSubmissionDialog(resp.data)
    } else {
      message.error(resp.err)
    }
  }

  /**
   * Called when user confirms to unsubmit the work before editing submission.
   */
  unsubmitWork = (e, workId) => {
    e.stopPropagation()
    this.props.dispatch({
      type: 'works/updateWork',
      payload: {
        data: {
          ...this.props.works[workId],
          submitted: false,
          last_modified: Date.now()
        },
        callback: this.onUnsubmitComplete
      }
    })
  }

  /**
   * Callback function called after work unsubmit has been processed by the backend.
   */
  onUnsubmitComplete = resp => {
    if (resp.data) {
      this.openSubmissionDialog(resp.data._id)
    } else {
      message.error(resp.err)
    }
  }

  /**
   * Called when the submit button is clicked.
   * Passed as props to the StudentSubmissionModal sub-component.
   */
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

  /**
   * Callback function called after the submission has been processed by the backend.
   */
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

  /**
   * Set the state to reflect closed submission modal.
   * Passed as props to the StudentSubmissionModal sub-component.
   */
  onClose = () => {
    this.setState({
      showSubmissionModal: false,
      currWorkId: null
    })
  }
  
  render() {
    const { problems, assignments, works } = this.props
    const { showSubmissionModal, submissionLoading, currWorkId } = this.state
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
            loading={submissionLoading}
            workId={currWorkId} 
            problemId={works[currWorkId].problem}
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