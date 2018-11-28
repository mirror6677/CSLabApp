import React from 'react'
import { Button, Form, Icon, Input, Select } from 'antd'
import styles from './DynamicTestForm.css'
import TEST_CATEGORIES from '../constants/test_categories'
import FilenameTestInput from './FilenameTestInput'

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
    return { filename: '', flags: [] }
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

    return (
      <Form>
        { tests.map((test, index) => (
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
            <Icon
              className={styles.delete_btn}
              type='minus-circle-o'
              onClick={() => this.remove(index)}
            />
            { test.category ? 
              (
                test.category === TEST_CATEGORIES.FILENAME ? 
                <FilenameTestInput 
                  content={test.content}
                  onUpdate={content => this.onContentUpdate(content, index)}
                /> : (
                  test.category === TEST_CATEGORIES.PYLINT ?
                  <Input/> :
                  <Input/>
                )
              ): 
              <Select 
                className={styles.form_item}
                value={test.category} 
                placeholder='Select type of the test'
                onChange={ value => this.onSelectCategory(value, index) }
              >
                { Object.keys(TEST_CATEGORIES).map(t => (
                  <Option key={TEST_CATEGORIES[t]} value={TEST_CATEGORIES[t]}>{`${TEST_CATEGORIES[t]} test`}</Option>
                )) }
              </Select> 
            }
          </FormItem>
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
