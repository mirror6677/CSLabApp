import React from 'react'
import { connect } from 'dva'
import { Table, Input, Button, Icon } from 'antd'
import styles from './GradesTable.css'

class GradesTable extends React.PureComponent {
  state = {
    searchText: '',
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'grades/getGrades',
      payload: this.props.courseId
    })
  }

  handleSearch = (selectedKeys, confirm) => () => {
    confirm()
    this.setState({ searchText: selectedKeys[0] })
  }

  handleReset = clearFilters => () => {
    clearFilters()
    this.setState({ searchText: '' })
  }

  render() {
    const { grades, total, columns } = this.props
    const tableColumns = columns ? [{
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className={styles.search_container}>
          <Input
            className={styles.search_input}
            ref={ele => this.searchInput = ele}
            placeholder='Search student username'
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={this.handleSearch(selectedKeys, confirm)}
          />
          <Button type='primary' onClick={this.handleSearch(selectedKeys, confirm)}>Search</Button>
          <Button onClick={this.handleReset(clearFilters)}>Reset</Button>
        </div>
      ),
      filterIcon: filtered => <Icon type='search' style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
      onFilter: (value, record) => record.username.toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => {
            this.searchInput.focus()
          })
        }
      }
    }, ...columns.map((assignmentId, index) => ({
      title: `HW${index} (${total[assignmentId] ? total[assignmentId] : 0})`,
      dataIndex: assignmentId,
      key: assignmentId
    })), {
      title: 'Average',
      dataIndex: 'average',
      key: 'average'
    }] : []

    const data = grades ? Object.keys(grades).sort().map(username => {
      var entry = { key: username, username }
      var total = 0
      columns.forEach(assignmentId => {
        entry[assignmentId] = grades[username][assignmentId] ? grades[username][assignmentId] : 0
        total += entry[assignmentId]
      })
      entry.average = total / columns.length
      return entry
    }) : []

    return <Table className={styles.table} columns={tableColumns} dataSource={data} size='middle' />
  }
}

export default connect(({ grades }) => ({
  grades: grades.grades,
  total: grades.total,
  columns: grades.columns
}))(GradesTable)
