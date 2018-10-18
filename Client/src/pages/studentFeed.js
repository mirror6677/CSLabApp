import React from 'react'
import { connect } from 'dva'
import { Collapse } from 'antd'
import styles from './studentFeed.css'

const Panel = Collapse.Panel

class StudentFeed extends React.PureComponent {

  getSortedProblems = () => {
    const { assignments, problems } = this.props
    const sortedAssignments = Object.keys(assignments).sort((a, b) => assignments[a].week_offset - assignments[b].week_offset)
    var sortedProblems = []
    for (var i = 0; i < sortedAssignments.length; i++) {
      console.log(assignments[sortedAssignments[i]].problems)
      sortedProblems = sortedProblems.concat(assignments[sortedAssignments[i]].problems.sort((a, b) => problems[a].day_offset - problems[b].day_offset))
    }
    return sortedProblems
  }
  
  render() {
    const { problems } = this.props
    const sortedProblems = Object.keys(problems).length ? this.getSortedProblems() : []
    return (
      sortedProblems.length && <Collapse bordered={false} defaultActiveKey={[sortedProblems[0]]}>
        { sortedProblems.map(problem => (
          <Panel header={problems[problem].name} key={problem} className={styles.problem_panel}>
            <div dangerouslySetInnerHTML={{ __html: `${problems[problem].content}` }} />
          </Panel>
        ))}
      </Collapse>
    )
  }
}

export default connect(({ assignments, problems }) => ({
  assignments,
  problems
}))(StudentFeed)