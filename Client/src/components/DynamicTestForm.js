import React from 'react'
import { Button, Checkbox, Divider, Form, Icon, Input, Select, Upload, message } from 'antd'
import styles from './DynamicTestForm.css'
import TEST_CATEGORIES from '../constants/test_categories'
import { API_ROOT } from '../constants/routes'
import TaggedInput from './TaggedInput'

const FormItem = Form.Item
const Option = Select.Option

export default class DynamicTestForm extends React.PureComponent {

  state = {
    tests: []
  }

  remove = index => {
    const { tests } = this.state
    this.setState({
      tests: [...tests.slice(0, index), ...tests.slice(index + 1)]
    })
  }

  add = () => {
    const { tests } = this.state
    this.setState({
      tests: [...tests, {}]
    })
  }

  onChangeTestName = (name, index) => {
    const { tests } = this.state
    this.setState({
      tests: [
        ...tests.slice(0, index),
        { ...tests[index], name },
        ...tests.slice(index + 1)
      ]
    })
  }

  onSelectCategory = (category, index) => {
    const { tests } = this.state
    var initialTest;
    if (category === TEST_CATEGORIES.FILENAME) {
      initialTest = this.getInitialFilenameTest()
    } else if (category === TEST_CATEGORIES.PYLINT) {
      initialTest = this.getInitialPylintTest()
    } else {
      initialTest = this.getInitialBlackboxTest()
    }
    this.setState({
      tests: [
        ...tests.slice(0, index), 
        { category, name: null, ta_only: false, content: initialTest }, 
        ...tests.slice(index + 1)
      ]
    })
  }

  getInitialFilenameTest = () => {
    return { filenames: [] }
  }

  getInitialPylintTest = () => {
    return { filenames: [], flags: [] }
  }

  getInitialBlackboxTest = () => {
    return { command: '', solution_included: false }
  }

  onContentUpdate = (content, index) => {
    const { tests } = this.state
    this.setState({
      tests: [
        ...tests.slice(0, index),
        { ...tests[index], content },
        ...tests.slice(index + 1)
      ]
    })
  }

  render() {
    const { tests } = this.state
    const { problemId } = this.props

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

    const props = dir => ({
      name: 'file',
      action: `${API_ROOT}/testfiles/tempuploads/${dir}`,
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
              directory: dir,
              filename: name
            }
          })
        }
      },
      fileList: this.state.fileList
    })

    return (
      <Form>
        { tests.map((test, index) => (
          <div>
            { index !== 0 && <Divider dashed /> }
            <FormItem
              {...formItemLayout}
              label={test.category ? `${test.category} test` : 'New test'}
              required={false}
              key={index}
            >
              <Input 
                placeholder='Test name' 
                className={styles.form_item} 
                onChange={e => this.onChangeTestName(e.target.value, index)} 
              />
              { (index === tests.length - 1 || index >= 2) && <Icon
                className={styles.delete_btn}
                type='minus-circle-o'
                onClick={() => this.remove(index)}
              /> }
              { test.category ? 
                (
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
                        placeholder='Command to execute' 
                        onChange={e => this.onContentUpdate({ ...test.content, command: e.target.value }, index)} 
                      />
                      <Checkbox onChange={e => this.onContentUpdate({ ...test.content, solution_included: e.target.checked }, index)}>
                        Upload solution file for output comparison
                      </Checkbox>
                      { test.content.solution_included && 
                        <Upload {...props(Date.now() + Math.random())}>
                          <Button>
                            <Icon type="upload" /> Click to Upload
                          </Button>
                        </Upload> 
                      }
                    </div>
                  )
                ) : 
                <Select 
                  className={styles.form_item}
                  value={test.category} 
                  placeholder='Select type of the test'
                  onChange={ value => this.onSelectCategory(value, index) }
                >
                  { Object.keys(TEST_CATEGORIES).map((t, i) => (
                    <Option key={TEST_CATEGORIES[t]} value={TEST_CATEGORIES[t]} disabled={i > index}>
                      {`${TEST_CATEGORIES[t]} test`}
                    </Option>
                  )) }
                </Select> 
              }
            </FormItem>
          </div>
        )) }
        <FormItem {...formItemLayoutWithoutLabel}>
          <Button type='dashed' onClick={this.add} style={{ width: '80%' }}>
            <Icon type='plus' /> Add test
          </Button>
        </FormItem>
      </Form>
    )
  }
}
