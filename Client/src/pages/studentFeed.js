import React from 'react'
import { connect } from 'dva'
import { Button, Collapse, Icon, Modal, Tooltip, Upload, message } from 'antd'
import styles from './studentFeed.css'
import moment from 'moment'

const Panel = Collapse.Panel
const Dragger = Upload.Dragger

class StudentFeed extends React.PureComponent {

  state = {
    showSubmissionModal: false,
    currProblem: {}
  }

  getProblemPanel = (assignment, problem) => {
    const { course, works } = this.props
    const { start_date } = course
    const work = Object.keys(works).filter(work => works[work].problem === problem._id)[0]
    var status = ''
    if (work && works[work].submitted) {
      status = 'Submitted.'
    } else if (work) {
      status = `Last modified on ${moment(works[work].last_modified).format('MM/DD/YYYY')}.`
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
                <Button size='small' icon='form' style={{ margin: 'auto', marginLeft: '20px' }} onClick={e => this.onOpenSubmissionDialog(e, problem, work)} />
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
          student: this.props.user.id,
          course: this.props.course._id,
          problem: problem._id,
          last_modified: Date.now()
        }
      })
    }
    this.setState({
      showSubmissionModal: true,
      currProblem: problem
    })
  }

  onSubmit = () => {
    
  }

  onClose = () => {
    this.setState({
      showSubmissionModal: false,
      currProblem: {}
    })
  }
  
  render() {
    const { course, problems, assignments, works } = this.props
    const sortedAssignments = Object.keys(assignments).sort((a, b) => assignments[a].week_offset - assignments[b].week_offset)

    const draggerProps = {
      name: 'file',
      multiple: true,
      action: 'http://localhost:8000/files/upload',
      onChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return (
      <div>
        { sortedAssignments.length && <Collapse bordered={false} defaultActiveKey={[sortedAssignments[0]]} className={styles.container}>
          { sortedAssignments.map(assignment => (
            assignments[assignment].problems.length && <Panel header={assignments[assignment].name} key={assignment} className={styles.assignment_panel}>
              <Collapse bordered={false}>
                { Object.keys(problems).length && assignments[assignment].problems.sort((a, b) => problems[a].day_offset - problems[b].day_offset).map(problem => this.getProblemPanel(assignment, problems[problem])) }
              </Collapse>
            </Panel>
          )) }
        </Collapse> }
        <Modal
          title={'Edit submission'}
          visible={this.state.showSubmissionModal}
          onOk={this.onSubmit}
          onCancel={this.onClose}
          footer={[
            <Button key="close" onClick={this.onClose}>Close</Button>,
            <Button key="submit" type="primary" onClick={this.onSubmit}>Submit</Button>
          ]}
        >
          <Dragger {...draggerProps}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
          </Dragger>
        </Modal>
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