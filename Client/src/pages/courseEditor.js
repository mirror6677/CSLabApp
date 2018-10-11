import React from 'react'
import { connect } from 'dva'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'

class CourseEditor extends React.PureComponent {
  
  state = {
    editorState: null
  }

  componentDidMount () {
    const htmlContent = ''
    this.setState({
      editorState: BraftEditor.createEditorState(htmlContent)
    })
  }

  submitContent = () => {
    const htmlContent = this.state.editorState.toHTML()
    const result = this.saveEditorContent(htmlContent)
  }

  handleEditorChange = editorState => {
    this.setState({ editorState })
  }

  saveEditorContent = content => {

  }

  render () {

    const { editorState } = this.state

    return (
      <div>
        <BraftEditor
          value={editorState}
          onChange={this.handleEditorChange}
          onSave={this.submitContent}
          language='en'
        />
      </div>
    )

  }
}

export default connect(({ courses }) => ({
  courses
}))(CourseEditor)