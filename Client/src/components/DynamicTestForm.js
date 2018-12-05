import React from 'react'
import { connect } from 'dva'
import { Button, Checkbox, Divider, Form, Icon, Input, Select, Upload, message } from 'antd'
import styles from './DynamicTestForm.css'
import TEST_CATEGORIES from '../constants/test_categories'
import { API_ROOT } from '../constants/routes'
import TaggedInput from './TaggedInput'

const FormItem = Form.Item
const Option = Select.Option

class DynamicTestForm extends React.PureComponent {

  state = {
    addingNew: false
  }

  remove = index => {
    const { tests, onUpdate } = this.props
    onUpdate([...tests.slice(0, index), ...tests.slice(index + 1)])
  }

  add = () => {
    this.setState({
      addingNew: true
    })
  }

  onSelectCategory = category => {
    this.props.dispatch({
      type: 'tests/addTest',
      payload: {
        test: { category, name: 'void', ta_only: false, content: {} },
        callback: this.onNewTestCreated
      }
    })
  }

  onNewTestCreated = test => {
    const { tests, onUpdate } = this.props
    onUpdate([...tests, test])
    this.setState({
      addingNew: false
    })
  }

  onTestNameUpdate = (name, index) => {
    const { tests, onUpdate } = this.props
    onUpdate([
      ...tests.slice(0, index),
      { ...tests[index], name },
      ...tests.slice(index + 1)
    ])
  }

  onContentUpdate = (content, index) => {
    const { tests, onUpdate } = this.props
    onUpdate([
      ...tests.slice(0, index),
      { ...tests[index], content },
      ...tests.slice(index + 1)
    ])
  }

  render() {
    const { addingNew } = this.state
    const { tests, files, solutionFiles } = this.props
    console.log(tests)

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      }
    }

    const formItemLayoutWithoutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      }
    }

    const fileUploadProps = testId => ({
      name: 'file',
      multiple: true,
      action: `${API_ROOT}/testfiles/upload/${testId}`,
      onChange: info => {
        const { status, name } = info.file
        if (status === 'done') {
          message.success(`${name} file uploaded successfully.`)
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`)
        } else if (status === 'removed') {
          this.props.dispatch({
            type: 'files/removeFile',
            payload: {
              id: testId,
              filename: name
            }
          })
        }
      },
      defaultFileList: testId && solutionFiles[testId] ? files[testId].map(file => ({
        uid: file,
        name: file,
        status: 'done',
        url: `${API_ROOT}/testfiles/download/${testId}/${file}`
      })) : []
    })


    const solutionFileUploadProps = testId => ({
      name: 'file',
      multiple: true,
      action: `${API_ROOT}/testfiles/solution/upload/${testId}`,
      onChange: info => {
        const { status, name } = info.file
        if (status === 'done') {
          message.success(`${name} file uploaded successfully.`)
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`)
        } else if (status === 'removed') {
          this.props.dispatch({
            type: 'files/removeSolutionFile',
            payload: {
              id: testId,
              filename: name
            }
          })
        }
      },
      defaultFileList: testId && solutionFiles[testId] ? solutionFiles[testId].map(file => ({
        uid: file,
        name: file,
        status: 'done',
        url: `${API_ROOT}/testfiles/solution/download/${testId}/${file}`
      })) : []
    })

    return (
      <Form>
        { tests.map((test, index) => (
          <div key={index}>
            { index !== 0 && <Divider dashed /> }
            <FormItem
              {...formItemLayout}
              label={`${test.category} test`}
              key={index}
            >
              <Input 
                placeholder='Test name' 
                className={styles.form_item} 
                value={test.name === 'void' ? '' : test.name}
                onChange={e => this.onTestNameUpdate(e.target.value, index)} 
              />
              { (index === tests.length - 1 || index >= 2) && <Icon
                className={styles.delete_btn}
                type='minus-circle-o'
                onClick={() => this.remove(index)}
              /> }
              { test.category && (
                test.category === TEST_CATEGORIES.FILENAME ? 
                <TaggedInput 
                  prompt='Filename'
                  data={test.content.filenames}
                  onUpdate={filenames => this.onContentUpdate({ ...test.content, filenames }, index)}
                /> : (
                  test.category === TEST_CATEGORIES.PYLINT ?
                  <div>
                    <TaggedInput
                      prompt='Filename'
                      data={test.content.filenames}
                      onUpdate={filenames => this.onContentUpdate({ ...test.content, filenames }, index)}
                    />
                    <TaggedInput
                      prompt='Flags'
                      data={test.content.flags}
                      onUpdate={flags => this.onContentUpdate({ ...test.content, flags }, index)}
                    />
                  </div> :
                  <div>
                    <Input 
                      className={styles.form_item}
                      placeholder='Command to execute'
                      defaultValue={test.content.command}
                      onChange={e => this.onContentUpdate({ ...test.content, command: e.target.value }, index)} 
                    />
                    <Upload {...fileUploadProps(test._id)}>
                      <Button>
                        <Icon type="upload" /> Click to upload supplementary files
                      </Button>
                    </Upload> 
                    <Checkbox 
                      defaultChecked={test.content.solution_included}
                      onChange={e => this.onContentUpdate({ ...test.content, solution_included: e.target.checked }, index)}
                    >
                      Upload solution file for output comparison
                    </Checkbox><br />
                    { test.content.solution_included && 
                      <Upload {...solutionFileUploadProps(test._id)}>
                        <Button>
                          <Icon type="upload" /> Click to upload solution files
                        </Button>
                      </Upload> 
                    }
                  </div>
                )
              )}
            </FormItem>
          </div>
        )) }
        { addingNew && <FormItem {...formItemLayout} label={'New test'}>
          <Select 
            className={styles.form_item}
            placeholder='Select type of the test'
            onChange={ value => this.onSelectCategory(value) }
          >
            { Object.keys(TEST_CATEGORIES).map((t, i) => (
              <Option key={TEST_CATEGORIES[t]} value={TEST_CATEGORIES[t]} disabled={i > tests.length}>
                {`${TEST_CATEGORIES[t]} test`}
              </Option>
            )) }
          </Select>
        </FormItem> }
        <FormItem {...formItemLayoutWithoutLabel}>
          <Button type='dashed' onClick={this.add} style={{ width: '80%' }} disabled={addingNew}>
            <Icon type='plus' /> Add test
          </Button>
        </FormItem>
      </Form>
    )
  }
}

export default connect(({ tests }) => ({
  files: tests.files,
  solutionFiles: tests.solutionFiles
}))(DynamicTestForm)
