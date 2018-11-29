import React from 'react'
import { connect } from 'dva'
import { Button, Icon, Select, Tabs } from 'antd'
import styles from './courseEditor.css'
import BraftEditor, { EditorState } from 'braft-editor'
import 'braft-editor/dist/index.css'
import NewAssignmentModal from '../components/NewAssignmentModal'
import NewProblemModal from '../components/NewProblemModal'
import DynamicTestForm from '../components/DynamicTestForm'

const Option = Select.Option
const TabPane = Tabs.TabPane

class CourseEditor extends React.PureComponent {
  
  state = {
    editorState: null,
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
        editorState: null
      })
    }
  }

  handleProblemChange = value => {
    if (value === '_new') {
      this.setState({ showNewProblemModal: true })
    } else {
      this.setState({ 
        selectedProblem: value,
        editorState: EditorState.createFrom(this.props.problems[value].content)
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

  submitContent = () => {
    const { selectedProblem } = this.state
    if (selectedProblem) {
      const content = this.state.editorState.toHTML()
      this.props.dispatch({
        type: 'problems/updateProblem',
        payload: {
          ...this.props.problems[selectedProblem],
          content
        }
      })
    }
  }

  handleEditorChange = editorState => {
    this.setState({ editorState })
  }

  render () {
    const { editorState, selectedAssignment, selectedProblem, showNewAssignmentModal, showNewProblemModal } = this.state
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
            { selectedProblem !== undefined && <DynamicTestForm /> }
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

export default connect(({ course, assignments, problems }) => ({
  course,
  assignments,
  problems
}))(CourseEditor)