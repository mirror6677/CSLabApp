import React from 'react'
import { Tag, Input, Tooltip, Icon } from 'antd'

export default class FilenameTestInput extends React.Component {
  state = {
    inputVisible: false,
    inputValue: '',
  }

  handleClose = removedTag => {
    const { content, onUpdate } = this.props
    const filenames = content.filenames.filter(tag => tag !== removedTag)
    onUpdate({ ...content, filenames })
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus())
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value })
  }

  handleInputConfirm = () => {
    const { inputValue } = this.state
    const { content, onUpdate } = this.props
    const filenames = inputValue && content.filenames.indexOf(inputValue) === -1 ? [...content.filenames, inputValue] : content.filenames
    this.setState({
      inputVisible: false,
      inputValue: '',
    })
    onUpdate({ ...content, filenames })
  }

  saveInputRef = input => this.input = input

  render() {
    const { inputVisible, inputValue } = this.state
    const filenames = this.props.content.filenames
    return (
      <div>
        {filenames.map((tag, index) => {
          const isLongTag = tag.length > 20
          const tagElem = (
            <Tag key={tag} closable={true} afterClose={() => this.handleClose(tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          )
          return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type='text'
            size='small'
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag
            onClick={this.showInput}
            style={{ background: '#fff', borderStyle: 'dashed' }}
          >
            <Icon type='plus' /> Filename
          </Tag>
        )}
      </div>
    )
  }
}
