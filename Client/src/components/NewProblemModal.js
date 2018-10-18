import React from 'react'
import { Input, Modal, Select } from 'antd'
import styles from './NewProblemModal.css'

const Option = Select.Option

export default class NewProblemModal extends React.PureComponent {

  state = {
    name: undefined,
    day_offset: undefined
  }

  onUpdateName = name => {
    this.setState({ name })
  }

  onUpdateDayOffset = day_offset => {
    this.setState({ day_offset })
  }

  onSubmit = () => {
    const { name, day_offset } = this.state
    if (name && day_offset !== undefined) {
      this.props.onSubmit({ name, day_offset })
      this.props.onClose()
      this.setState({
        name: undefined,
        day_offset: undefined
      })
    }
  }
  
  render() {
    const { name, day_offset } = this.state
    const { visible, onClose } = this.props
    return (
      <Modal
        title={'New problem'}
        visible={visible}
        onOk={this.onSubmit}
        onCancel={onClose}
      >
        <Input 
          className={styles.formItem}
          value={name}
          placeholder='Problem name'
          onChange={ e => this.onUpdateName(e.target.value) } 
        />
        <Select 
          className={styles.formItem} 
          value={day_offset} 
          placeholder='Day offset'
          onChange={this.onUpdateDayOffset}
        >
          { Array.apply(null, {length: 7}).map(Number.call, Number).map(n => (
            <Option key={n} value={n}>{n}</Option>
          )) }
        </Select>
      </Modal>
    )
  }
}
