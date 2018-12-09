import React from 'react'
import { connect } from 'dva'
import { Button, Icon, Modal, Steps, Tooltip, Upload, message } from 'antd'
import styles from './StudentSubmissionModal.css'
import { API_ROOT } from '../constants/routes'
import TEST_CATEGORIES from '../constants/test_categories'

const { Dragger } = Upload
const { Step } = Steps

class StudentSubmissionModal extends React.PureComponent {

  state = {
    fileList: []
  }

  componentDidMount() {
    const { files, workId } = this.props

    if (workId && files[workId]) {
      this.setState({
        fileList: files[workId].map(file => ({
          uid: file,
          name: file,
          status: 'done',
          url: `${API_ROOT}/files/download/${workId}/${file}`
        }))
      })
    }
  }

  getTestStep = (testId, index) => {
    const { works, tests, testResults, workId } = this.props
    const test = tests[testId]
    const testResult = testResults[works[workId].test_results[index]]
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

  runFilenameTest = () => {
    const { fileList } = this.state
    const { problems, problemId, tests, works, workId, testResults } = this.props
    const testIds = problems[problemId].tests
    testIds.forEach((testId, index) => {
      if (tests[testId].category === TEST_CATEGORIES.FILENAME) {
        var result = []
        var filenames = tests[testId].content.filenames
        fileList.map(file => file.name).forEach(filename => {
          if (filenames.includes(filename)) {
            result.push(filename)
          }
        })
        if (result.length === filenames.length) {
          if (!works[workId].test_results[index]) {
            this.props.dispatch({
              type: 'testResults/addTestResult',
              payload: {
                data: {
                  test_id: testId,
                  status: 'Passed',
                  content: 'Filename test passed'
                },
                callback: this.onNewTestResultCreated(index)
              }
            })
          } else if (testResults[works[workId].test_results[index]].status !== 'Passed') {
            this.props.dispatch({
              type: 'testResults/updateTestResult',
              payload: {
                data: {
                  ...testResults[works[workId].test_results[index]],
                  status: 'Passed',
                  content: 'Filename test passed'
                }
              }
            })
          }
          this.runPylintTest()
        } else if (works[workId].test_results[index] && testResults[works[workId].test_results[index]].status === 'Passed') {
          this.props.dispatch({
            type: 'testResults/updateTestResult',
            payload: {
              data: {
                ...testResults[works[workId].test_results[index]],
                status: 'Failed',
                content: 'Filename test failed'
              }
            }
          })
        }
      }
    })
  }

  runPylintTest = () => {
    const { problems, problemId, tests, workId } = this.props
    const testIds = problems[problemId].tests
    testIds.forEach((testId, index) => {
      if (tests[testId].category === TEST_CATEGORIES.PYLINT) {
        this.props.dispatch({
          type: 'tests/runPylint',
          payload: {
            testId: tests[testId].content._id,
            workId,
            callback: this.onPylintTestFinished(testId, index)
          }
        })
      }
    })
  }

  onPylintTestFinished = (testId, index) => {
    return data => {
      const { works, workId, testResults } = this.props
      if (!works[workId].test_results[index]) {
        this.props.dispatch({
          type: 'testResults/addTestResult',
          payload: {
            data: {
              test_id: testId,
              status: data.err ? 'Failed' : 'Passed',
              content: data.err ? data.err : data.data
            },
            callback: this.onNewTestResultCreated(index)
          }
        })
      } else {
        this.props.dispatch({
          type: 'testResults/updateTestResult',
          payload: {
            data: {
              ...testResults[works[workId].test_results[index]],
              status: data.err ? 'Failed' : 'Passed',
              content: data.err ? data.err : data.data
            }
          }
        })
      }
    }
  }

  onNewTestResultCreated = index => {
    return data => {
      if (data.data) {
        const { works, workId } = this.props
        var test_results = [...works[workId].test_results]
        test_results[index] = data.data
        this.props.dispatch({
          type: 'works/updateWork',
          payload: {
            data: { ...works[workId], test_results }
          }
        })
      } else {
        message.error(data.err)
      }
    }
  }

  render() {
    const { visible, loading, workId, problemId, onSubmit, onClose, problems, works } = this.props
    const { fileList } = this.state
    const problem = problems[problemId]

    const draggerProps = {
      name: 'file',
      multiple: true,
      action: `${API_ROOT}/files/upload/${workId}`,
      onChange: info => {
        const { status, name } = info.file
        if (status === 'done') {
          message.success(`${name} file uploaded successfully.`)
          this.props.dispatch({
            type: 'files/fileUploaded',
            payload: {
              workId: workId,
              filename: name
            }
          })
        } else if (status === 'error') {
          message.error(`${name} file upload failed.`)
        } else if (status === 'removed') {
          this.props.dispatch({
            type: 'files/removeFile',
            payload: {
              workId,
              filename: name
            }
          })
        }
        const fileList = info.fileList.map(file => {
          if (file.status === 'done' && !file.url) {
            file.url = `${API_ROOT}/files/download/${workId}/${file.name}`
          }
          return file
        })
        this.setState({ fileList }, () => (status === 'done' || status === 'removed') && this.runFilenameTest())
      },
      fileList: fileList
    } 

    return (
      <Modal
        title={'Edit submission'}
        visible={visible}
        width={'85%'}
        onOk={onSubmit}
        onCancel={onClose}
        maskClosable={false}
        footer={[
          <Button key='close' onClick={onClose}>Close</Button>,
          <Button key='submit' type='primary' loading={loading} onClick={onSubmit}>Submit</Button>
        ]}
      >
        <div className={styles.container}>
          <div className={styles.left_container}>
            <Dragger {...draggerProps}>
              <p className='ant-upload-drag-icon'>
                <Icon type='inbox' />
              </p>
              <p className='ant-upload-text'>Click or drag files to this area to upload</p>
              <p className='ant-upload-hint'>By uploading your files here, you acknowledge that they reflect your original work and all references are properly cited</p>
            </Dragger>
          </div>
          <div className={styles.right_container}>
            <p className={styles.test_header}>Automated Tests:</p>
            <Steps 
              direction='vertical' 
              size={problem.tests.length > 3 ? 'small' : 'default'} 
              current={works[workId].test_results.length}
            >
              { problem.tests.map((testId, index) => this.getTestStep(testId, index)) }
            </Steps>
          </div>
        </div>                
      </Modal>
    )
  }
}

export default connect(({ problems, works, files, tests, testResults }) => ({
  problems,
  works,
  files: Object.keys(files).reduce((result, item) => {
    result[item] = Object.keys(files[item])
    return result
  }, {}),
  tests: tests.tests,
  testResults
}))(StudentSubmissionModal)