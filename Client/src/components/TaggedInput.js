import React from 'react'
import { Tag, Input, Tooltip, Icon } from 'antd'

export default class TaggedInput extends React.PureComponent {
  
  state = {
    inputVisible: false,
    inputValue: '',
  }

  handleClose = removedTag => {
    const { data, onUpdate } = this.props
    const newData = data.filter(tag => tag !== removedTag)
    onUpdate(newData)
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus())
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value })
  }

  handleInputConfirm = () => {
    const { inputValue } = this.state
    const { data, onUpdate } = this.props
    const newData = inputValue && data.indexOf(inputValue) === -1 ? [...data, inputValue] : data
    this.setState({
      inputVisible: false,
      inputValue: '',
    })
    onUpdate(newData)
  }

  saveInputRef = input => this.input = input

  render() {
    const { inputVisible, inputValue } = this.state
    const { data, prompt } = this.props

    return (
      <div>
        {data.map(tag => {
          const isLongTag = tag.length > 30
          const tagElem = (
            <Tag key={tag} closable={true} afterClose={() => this.handleClose(tag)}>
              {isLongTag ? `${tag.slice(0, 30)}...` : tag}
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
            <Icon type='plus' /> {prompt}
          </Tag>
        )}
      </div>
    )
  }
}
