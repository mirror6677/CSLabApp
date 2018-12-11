import React from 'react'
import { connect } from 'dva'
import { Alert, Button, Icon, Input, Modal, Steps, Table, Tooltip } from 'antd'
import styles from './TAGradingModal.css'
import { API_ROOT } from '../constants/routes'
import filesize from 'filesize'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { rainbow } from 'react-syntax-highlighter/styles/hljs'

const { TextArea } = Input
const { Step } = Steps

class TAGradingModal extends React.PureComponent {

  state = {
    selectedFile: null,
    comment: '',
    grade: '',
    ready: false,
    showTestResults: true
  }

  componentDidMount() {
    this.getFiles()
    this.initializeFields()
  }

  componentDidUpdate(prevProps) {
    const work = this.props.work
    const prevWork = prevProps.work
    if (work.grade !== prevWork.grade || work.comment !== prevWork.comment) {
      this.initializeFields()
    }
    if (work._id !== prevWork._id) {
      this.getFiles()
    }
  }

  initializeFields = () => {
    const work = this.props.work
    const grade = work.grade ? work.grade : ''
    const comment = work.comment ? work.comment : ''
    this.setState({ 
      grade, 
      comment, 
      ready: this.checkGradeValid(grade)
    })
  }

  getFiles = () => {
    const { work, files } = this.props
    Object.keys(files[work._id]).forEach(file => {
      this.props.dispatch({
        type: 'files/getFile',
        payload: {
          workId: work._id,
          filename: file
        }
      })
    })
  }

  selectFile = record => {
    this.setState({
      selectedFile: record.key,
      showTestResults: false
    })
  }

  downloadFile = filename => {
    window.open(`${API_ROOT}/files/download/${this.props.work._id}/${filename}`, '_blank').focus()
  }

  onCommentChanged = e => {
    this.setState({
      comment: e.target.value
    })
  }

  onGradeChanged = e => {
    const grade = e.target.value
    this.setState({ 
      grade, 
      ready: this.checkGradeValid(grade)
    })
  }

  checkGradeValid = grade => {
    const reg = /^(0|[1-9][0-9]*)(\.[0-9]+)?$/
    return !isNaN(grade) && reg.test(grade)
  }

  onSubmit = next => {
    const { work, user } = this.props
    const { grade, comment } = this.state
    const gradedWork = {
      ...work,
      graded: true,
      grade: parseFloat(grade),
      comment,
      graded_by: user.id
    }
    this.setState({
      selectedFile: null,
      comment: '',
      grade: '',
      ready: false
    }, () => this.props.onSubmit(gradedWork, next))
  }

  getTestStep = (testId, index) => {
    const { work, tests, testResults } = this.props
    const test = tests[testId]
    const testResult = testResults[work.test_results[index]]
    const title = testResult ? testResult.status : 'Waiting'
    const content = testResult ? testResult.content : ''
    var status
    if (title === 'Waiting') {
      status = 'wait'
    } else if (title === 'Passed') {
      status = 'finish'
    } else if (title === 'Failed') {
      status = 'error'
    } else {
      status = 'process'
    }
    return (
      <Step 
        key={index}
        title={<Tooltip title={content}>{title}</Tooltip>} 
        description={test.name} 
        status={status}
      />
    )
  }

  getActionFooterButton = () => {
    const { showNext, loading } = this.props
    const { ready } = this.state
    return showNext ? ([
      <Button key='submit' type='primary' loading={loading} onClick={ () => this.onSubmit(false) } disabled={!ready}>
        Submit
      </Button>,
      <Button key='next' type='primary' loading={loading} onClick={ () => this.onSubmit(true) } disabled={!ready}>
        {'Submit & Next'}
      </Button>
    ]) : ([
      <Button key='submit' type='primary' loading={loading} onClick={ () => this.onSubmit(false) } disabled={!ready}>
        Submit
      </Button>
    ])
  }

  showTestResults = () => {
    this.setState({
      selectedFile: null,
      showTestResults: true
    })
  }

  render() {
    const { visible, work, problem, onClose, files } = this.props
    const { selectedFile, comment, grade, showTestResults } = this.state

    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    }, {
      title: '',
      dataIndex: 'action',
      key: 'action',
    }]

    const data = Object.keys(files[work._id]).map(file => ({
      key: file,
      name: file,
      size: filesize(files[work._id][file].Size),
      action: <Icon 
        type='cloud-download' 
        className={styles.download_icon} 
        onClick={() => this.downloadFile(file)} 
      />
    }))

    return (
      <Modal
        title={'Grade submission'}
        visible={visible}
        onOk={ () => this.onSubmit(false) }
        onCancel={onClose}
        width={'85%'}
        style={{ top: '50px' }}
        bodyStyle={{ height: 'calc(100vh - 200px)' }}
        maskClosable={false}
        footer={[
          <Button key='close' onClick={onClose}>Close</Button>,
          ...this.getActionFooterButton()
        ]}
      >
        <div className={styles.container}>
          <div className={styles.left_container}>
            <Table 
              dataSource={data} 
              columns={columns}
              size={'small'}
              pagination={false}
              rowSelection={{ 
                type: 'radio', 
                selectedRowKeys: [selectedFile],
                onSelect: record => this.selectFile(record)
              }}
              onRow={ record => ({
                onClick: () => {
                  this.selectFile(record)
                }
              }) }
            />
            <div>
              <span className={styles.show_test_btn} onClick={this.showTestResults}>
                Show test results
              </span>
              <TextArea 
                rows={4} 
                value={comment} 
                onChange={this.onCommentChanged} 
                placeholder={'Comment'} 
                style={{ marginTop: '12pt', marginBottom: '12pt' }}
              />
              <Input 
                value={grade}
                onChange={this.onGradeChanged}
                placeholder={'Grade'} 
                addonAfter={`out of ${problem.total_points}`}
              />
            </div>
          </div>
          { files[work._id][selectedFile] && files[work._id][selectedFile].Body && (
            <SyntaxHighlighter className={styles.file_display} showLineNumbers={true} style={rainbow}>
              {files[work._id][selectedFile].Body}
            </SyntaxHighlighter> 
          )}
          { files[work._id][selectedFile] && !files[work._id][selectedFile].Body && (
            <div className={styles.file_display}>
              <Alert message='File type not supported. Please use the download option from the file menu.' banner />
            </div> 
          )}
          { showTestResults && (
            <div className={styles.test_display}>
              <p className={styles.test_header}>Automated Tests:</p>
              <Steps 
                direction='vertical' 
                size={problem.tests.length > 3 ? 'small' : 'default'} 
                current={work.test_results.length}
              >
                { problem.tests.map((testId, index) => this.getTestStep(testId, index)) }
              </Steps>
            </div>
          ) }
        </div>
      </Modal>
    )
  }
}

export default connect(({ user, files, tests, testResults }) => ({
  user,
  files,
  tests: tests.tests,
  testResults
}))(TAGradingModal)