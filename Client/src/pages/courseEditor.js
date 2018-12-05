import React from 'react'
import { connect } from 'dva'
import { Button, Icon, Select, Tabs, message } from 'antd'
import styles from './courseEditor.css'
import BraftEditor, { EditorState } from 'braft-editor'
import 'braft-editor/dist/index.css'
import NewAssignmentModal from '../components/NewAssignmentModal'
import NewProblemModal from '../components/NewProblemModal'
import DynamicTestForm from '../components/DynamicTestForm'
import TEST_CATEGORIES from '../constants/test_categories'

const Option = Select.Option
const TabPane = Tabs.TabPane

class CourseEditor extends React.PureComponent {
  
  state = {
    editorState: null,
    tests: [],
    selectedAssignment: undefined,
    selectedProblem: undefined,
    showNewAssignmentModal: false,
    showNewProblemModal: false
  }

  handleAssignmentChange = value => {
    if (value === '_new') {
      this.setState({ showNewAssignmentModal: true })
    } else {
      this.setState({
        selectedAssignment: value,
        selectedProblem: undefined,
        editorState: null,
        tests: []
      })
    }
  }

  handleProblemChange = value => {
    const { problems, tests } = this.props
    if (value === '_new') {
      this.setState({ showNewProblemModal: true })
    } else {
      this.setState({ 
        selectedProblem: value,
        editorState: EditorState.createFrom(problems[value].content),
        tests: problems[value].tests.map(testId => tests[testId])
      })
    }
  }

  handleNewAssignmentSubmit = assignment => {
    this.props.dispatch({
      type: 'assignments/addAssignment',
      payload: {
        courseId: this.props.course._id,
        assignment
      }
    })
  }

  handleNewAssignmentCancel = () => {
    this.setState({
      showNewAssignmentModal: false
    })
  }

  handleNewProblemSubmit = problem => {
    this.props.dispatch({
      type: 'problems/addProblem',
      payload: {
        assignmentId: this.state.selectedAssignment,
        problem
      }
    })
  }

  handleNewProblemCancel = () => {
    this.setState({
      showNewProblemModal: false
    })
  }

  validateTests = () => {
    const { tests } = this.state
    tests.forEach(test => {
      const { category, content } = test
      if (category === TEST_CATEGORIES.FILENAME) {
        if (!content.filenames || content.filenames.length === 0) {
          return 'Filename test error'
        }
      } else if (category === TEST_CATEGORIES.PYLINT) {
        if (!content.filenames || content.filenames.length === 0) {
          return 'Pylint test error'
        }
      } else if (category === TEST_CATEGORIES.BLACKBOX) {
        if (!content.command || content.command.length === 0) {
          return 'Blackbox test error'
        }
      } else {
        return 'Test type error'
      }
    })
    return null
  }

  submitContent = () => {
    const { selectedProblem, editorState, tests } = this.state
    const error = this.validateTests()
    if (error) {
      message.error(error)
      return
    }
    if (selectedProblem) {
      tests.forEach(test => {
        this.props.dispatch({
          type: 'tests/updateTest',
          payload: {
            test
          }
        })
      })
      const content = editorState.toHTML()
      this.props.dispatch({
        type: 'problems/updateProblem',
        payload: {
          ...this.props.problems[selectedProblem],
          content,
          tests: tests.map(test => test._id)
        }
      })
      message.success('Problem saved')
    } else {
      message.warning('No problem selected')
    }
  }

  handleEditorChange = editorState => {
    this.setState({ editorState })
  }

  handleTestUpdate = tests => {
    this.setState({ tests })
  }

  render () {
    const { editorState, tests, selectedAssignment, selectedProblem, showNewAssignmentModal, showNewProblemModal } = this.state
    const { course, assignments, problems } = this.props

    return (
      <div className={styles.container}>
        <Select 
          className={styles.dropdown_select} 
          value={selectedAssignment} 
          placeholder='Select an assignment'
          onChange={this.handleAssignmentChange}
        >
          <Option value='_new'>Add new assignment</Option>
          { course && 
            course.assignments
            .sort((a, b) => assignments[a].week_offset - assignments[b].week_offset)
            .map(assignment => (
              <Option key={assignments[assignment]._id} value={assignments[assignment]._id}>{assignments[assignment].name}</Option>
            )) }
        </Select>
        <Select 
          className={styles.dropdown_select} 
          value={selectedProblem} 
          placeholder='Select a problem'
          disabled={selectedAssignment === undefined} 
          onChange={this.handleProblemChange}
        >
          <Option value='_new'>Add new problem</Option>
          { selectedAssignment && 
            assignments[selectedAssignment].problems
            .sort((a, b) => problems[a].day_offset - problems[b].day_offset)
            .map(problem => (
              <Option key={problems[problem]._id} value={problems[problem]._id}>{problems[problem].name}</Option>
            )) }
        </Select>
        <Button type="primary" className={styles.submit_btn} onClick={this.submitContent}>SAVE</Button>
        <Tabs defaultActiveKey={'1'}>
          <TabPane tab={<span><Icon type='file-text' />Content</span>} key='1'>
            <BraftEditor
              className={styles.my_editor}
              disabled={selectedProblem === undefined}
              value={editorState}
              onChange={this.handleEditorChange}
              onSave={this.submitContent}
              language='en'
            />
          </TabPane>
          <TabPane tab={<span><Icon type='file-search' />Tests</span>} key='2' disabled={selectedProblem === undefined}>
            { selectedProblem !== undefined && <DynamicTestForm tests={tests} onUpdate={this.handleTestUpdate} /> }
          </TabPane>
        </Tabs>
        <NewAssignmentModal 
          visible={showNewAssignmentModal} 
          onSubmit={this.handleNewAssignmentSubmit} 
          onClose={this.handleNewAssignmentCancel} 
        />
        <NewProblemModal 
          visible={showNewProblemModal}
          onSubmit={this.handleNewProblemSubmit}
          onClose={this.handleNewProblemCancel}
        />
      </div>
    )
  }
}

export default connect(({ course, assignments, problems, tests }) => ({
  course,
  assignments,
  problems,
  tests: tests.tests
}))(CourseEditor)