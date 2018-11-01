import React from 'react'
import { connect } from 'dva'
import { Button, Collapse, Tooltip,  message } from 'antd'
import styles from './TAFeed.css'
import moment from 'moment'

const Panel = Collapse.Panel

class TAFeed extends React.PureComponent {

  state = {

  }

  componentDidMount() {
    this.props.dispatch({
      type: 'works/getAll',
      payload: {
        course: this.props.course._id
      }
    })
  }

  getSortedProblems = () => {
    const { works } = this.props
    const sortedWorks = Object.keys(works).sort((a, b) => new Date(works[a].last_modified).getTime() - new Date(works[b].last_modified).getTime())
    var sortedProblems = []
    var workDict = {}
    sortedWorks.forEach(workId => {
      const problemId = works[workId].problem
      if (!workDict[problemId]) {
        workDict[problemId] = [workId]
        sortedProblems.push(problemId)
      } else {
        workDict[problemId] = workDict[problemId].concat([workId])
      }
    })
    return { sortedProblems, workDict }
  }

  getWorkPanel = work => {
    work = this.props.works[work]
    return (
      <Panel
        header={
          <div>
            {work._id}
            <div style={{ float: 'right', marginRight: '20px' }}>
              <span>
                {`Submitted on ${moment(work.last_modified).format('MM/DD/YYYY')}`}
              </span>
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
  
  render() {
    const { problems } = this.props
    const { sortedProblems, workDict } = this.getSortedProblems()

    return (
      <div>
        { sortedProblems.length && <Collapse 
          bordered={false} 
          defaultActiveKey={[sortedProblems[0]]} 
          className={styles.container}
        >
          { sortedProblems.map(problem => (
            workDict[problem].length && <Panel 
              header={`${problems[problem].name}`} 
              key={problem} 
              className={styles.problem_panel}
            >
              <Collapse bordered={false}>
                <Panel header='Original problem' className={styles.problem_description_panel}>
                  <div dangerouslySetInnerHTML={{ __html: `${problems[problem].content}` }} />
                </Panel>
                { workDict[problem].map(work => this.getWorkPanel(work)) }
              </Collapse>
            </Panel>
          )) }
        </Collapse> }
      </div>
    )
  }
}

export default connect(({ user, course, problems, works }) => ({
  user,
  course,
  problems,
  works: Object.keys(works).reduce((result, item) => {
    if (works[item].submitted) {
      result[item] = works[item]
    }
    return result
  }, {})
}))(TAFeed)