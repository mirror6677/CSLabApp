import React from 'react'
import { connect } from 'dva'
import { Button, Collapse, Tooltip,  message } from 'antd'
import styles from './TAFeed.css'
import moment from 'moment'
import TAGradingModal from '../components/TAGradingModal'

const Panel = Collapse.Panel

class TAFeed extends React.PureComponent {

  state = {
    showGradingModal: false,
    submissionLoading: false,
    currWorkId: null
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'works/getAll',
      payload: {
        course: this.props.course._id
      }
    })
  }

  /**
   * Returns a work dictionary with problem IDs as keys and lists of work IDs as values.
   */
  getWorkDict = () => {
    const { works } = this.props
    var workDict = {}
    Object.keys(works).forEach(workId => {
      const problemId = works[workId].problem
      if (!workDict[problemId]) {
        workDict[problemId] = [workId]
      } else {
        workDict[problemId] = [...workDict[problemId], workId]
      }
    })
    this.workDict = workDict
    return workDict
  }

  /**
   * Returns the collapsable panel for each work given the work ID.
   */
  getWorkPanel = work => {
    work = this.props.works[work]
    return (
      <Panel
        header={
          <div>
            {work._id}
            <div style={{ float: 'right', marginRight: '20px' }}>
              <span>
                {work.graded ? 'Graded' : `Submitted on ${moment(work.last_modified).format('MM/DD/YYYY')}`}
              </span>
              <Tooltip title='Grade' placement='topRight'>
                <Button 
                  size='small' 
                  icon='form' 
                  style={{ margin: 'auto', marginLeft: '20px' }} 
                  onClick={e => this.onOpenGradingDialog(e, work._id)} 
                />
              </Tooltip>
            </div>
          </div>
        } 
        key={work._id} 
        className={styles.work_panel}
      >
        <div/>
      </Panel>
    )
  }

  /**
   * Called when the grading button is clicked.
   */
  onOpenGradingDialog = (e, workId) => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({
      showGradingModal: true,
      currWorkId: workId
    })
  }

  /**
   * Called when the submit button is clicked.
   * Passed as props to the TAGradingModal sub-component.
   */
  onSubmit = (work, next) => {
    this.setState({
      submissionLoading: true
    })
    this.props.dispatch({
      type: 'works/updateWork',
      payload: {
        data: work,
        callback: next ? this.onSubmitCompleteAndNext : this.onSubmitComplete
      }
    })
  }

  /**
   * Callback function called after the submission has been processed by the backend.
   */
  onSubmitComplete = resp => {
    this.setState({
      submissionLoading: false,
      showGradingModal: false,
      currWorkId: null
    })
    if (resp.data) {
      message.success('You work has been submitted successfully')
    } else {
      message.error(resp.err)
    }
  }

  /**
   * Callback function called after the submission has been processed by the backend.
   * This is called instead of onSubmitComplete when user clicked on Submit and next.
   * Looks for the next submission for the current problem and update the modal.
   * If the current submission is the last one of the current problem, modal will be closed.
   */
  onSubmitCompleteAndNext = resp => {
    const { currWorkId } = this.state
    var nextWorkId = currWorkId
    var showGradingModal = true
    if (resp.data) {
      message.success('You work has been submitted successfully')
      const problem = this.workDict[resp.data.problem]
      const currIndex = problem.indexOf(currWorkId)
      if (currIndex + 1 < problem.length) {
        nextWorkId = problem[currIndex + 1]
      } else {
        message.warning('No more submissions for the current problem')
        showGradingModal = false
      }
    } else {
      message.error(resp.err)
    }
    this.setState({
      currWorkId: nextWorkId,
      showGradingModal,
      submissionLoading: false
    })
  }

  /**
   * Set the state to reflect closed submission modal.
   * Passed as props to the TAGradingModal sub-component.
   */
  onClose = () => {
    this.setState({
      showGradingModal: false,
      currWorkId: null
    })
  }
  
  render() {
    const { course, assignments, problems, works } = this.props
    const { showGradingModal, submissionLoading, currWorkId } = this.state
    const sortedAssignments = Object.keys(assignments).sort((a, b) => assignments[a].week_offset - assignments[b].week_offset)
    const workDict = this.getWorkDict()

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
              { Object.keys(problems).length && 
                assignments[assignment].problems
                .sort((a, b) => problems[a].day_offset - problems[b].day_offset)
                .map(problem => (
                <Collapse bordered={false} key={problem} className={styles.problem_container}>
                  <Panel 
                    header={
                      <div>
                        {problems[problem].name}
                        <span style={{ float: 'right', marginRight: '20px' }}>
                            {`Due on ${moment(course.start_date).add({ days: problems[problem].day_offset, weeks: assignments[assignment].week_offset }).format('MM/DD/YYYY')}`}
                          </span>
                      </div>
                    } 
                    className={styles.problem_description_panel}
                  >
                    <div dangerouslySetInnerHTML={{ __html: `${problems[problem].content}` }} />
                  </Panel>
                  { workDict[problem] && workDict[problem].map(work => this.getWorkPanel(work)) }
                </Collapse>
              )) }
            </Panel>
          )) }
        </Collapse> }
        { showGradingModal && <TAGradingModal 
          visible={showGradingModal}
          loading={submissionLoading}
          work={works[currWorkId]}
          totalPoints={problems[works[currWorkId].problem].total_points}
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
  works: Object.keys(works).reduce((result, item) => {
    if (works[item].submitted) {
      result[item] = works[item]
    }
    return result
  }, {})
}))(TAFeed)