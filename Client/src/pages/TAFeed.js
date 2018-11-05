import React from 'react'
import { connect } from 'dva'
import { Button, Collapse, Tooltip,  message } from 'antd'
import styles from './TAFeed.css'
import moment from 'moment'

const Panel = Collapse.Panel

class TAFeed extends React.PureComponent {

  state = {
    showGradingModal: false,
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
        workDict[problemId] = workDict[problemId].concat([workId])
      }
    })
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
  
  render() {
    const { course, assignments, problems } = this.props
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