import React from 'react'
import { connect } from 'dva'
import { Select } from 'antd'
import styles from './stats.css'
import STATS_MODE from '../../constants/stats_mode'
import GradesTable from '../../components/admin/GradesTable'
import moment from 'moment'

const Option = Select.Option

class Stats extends React.PureComponent {

  state = {
    semester: null,
    mode: null
  }

  componentDidMount() {
    const { courses } = this.props
    this.setState({
      semester: Object.keys(courses).filter(courseId => courses[courseId].active)[0],
      mode: STATS_MODE.ALL.id
    })
  }

  handleSemesterChange = semester => {
    this.setState({ semester })
  }

  handleModeChange = mode => {
    this.setState({ mode })
  }
  
  render() {
    const { courses } = this.props
    const { semester, mode } = this.state

    return (
      <div className={styles.container}>
        <div className={styles.select_container}>
          <Select
            value={semester}
            className={styles.select}
            placeholder="Select a semester"
            onChange={this.handleSemesterChange}
          >
            { Object.keys(courses).map(courseId => (
              <Option key={courseId} value={courseId}>
                {`${courses[courseId].semester} (${moment(courses[courseId].start_date).format('MM/DD/YYYY')})`}
              </Option>
            )) }
          </Select>

          <Select
            value={mode}
            className={styles.select}
            placeholder="Select a mode"
            onChange={this.handleModeChange}
          >
            { Object.keys(STATS_MODE).map(mode => (
              <Option key={STATS_MODE[mode].id} value={STATS_MODE[mode].id}>
                {STATS_MODE[mode].value}
              </Option>
            )) }
          </Select>
        </div>
        { mode === STATS_MODE.ALL.id && <GradesTable courseId={semester} /> }
      </div>
    )
  }
}

export default connect(({ courses }) => ({
  courses
}))(Stats)