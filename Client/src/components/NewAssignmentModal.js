import React from 'react'
import { Input, Modal, Select } from 'antd'
import styles from './NewAssignmentModal.css'

const Option = Select.Option

export default class NewAssignmentModal extends React.PureComponent {

  state = {
    name: undefined,
    description: undefined,
    week_offset: undefined
  }

  onUpdateName = name => {
    this.setState({ name })
  }

  onUpdateDescription = description => {
    this.setState({ description })
  }

  onUpdateWeekOffset = week_offset => {
    this.setState({ week_offset })
  }

  onSubmit = () => {
    const { name, description, week_offset } = this.state
    if (name && description && week_offset !== undefined) {
      this.props.onSubmit({ name, description, week_offset })
      this.props.onClose()
      this.setState({
        name: undefined,
        description: undefined,
        week_offset: undefined
      })
    }
  }
  
  render() {
    const { name, description, week_offset } = this.state
    const { visible, onClose } = this.props
    return (
      <Modal
        title={'New assignment'}
        visible={visible}
        onOk={this.onSubmit}
        onCancel={onClose}
      >
        <Input 
          className={styles.formItem}
          value={name}
          placeholder='Assignment name'
          onChange={ e => this.onUpdateName(e.target.value) } 
        />
        <Input 
          className={styles.formItem}
          value={description}
          placeholder='Assignment description'
          onChange={ e => this.onUpdateDescription(e.target.value) } 
        />
        <Select 
          className={styles.formItem} 
          value={week_offset} 
          placeholder='Week offset'
          onChange={this.onUpdateWeekOffset}
        >
          { Array.apply(null, {length: 14}).map(Number.call, Number).map(n => (
            <Option key={n} value={n}>{n}</Option>
          )) }
        </Select>
      </Modal>
    )
  }
}
