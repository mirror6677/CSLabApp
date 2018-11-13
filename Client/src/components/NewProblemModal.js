import React from 'react'
import { Input, Modal, Select } from 'antd'
import styles from './NewProblemModal.css'
import NUM_TO_DAY from '../constants/num_to_day'

const Option = Select.Option

export default class NewProblemModal extends React.PureComponent {

  state = {
    name: undefined,
    day_offset: undefined,
    total_points: undefined
  }

  onUpdateName = name => {
    this.setState({ name })
  }

  onUpdateDayOffset = day_offset => {
    this.setState({ day_offset })
  }

  onUpdateTotalPoints = total_points => {
    this.setState({ total_points })
  }

  onSubmit = () => {
    const { name, day_offset, total_points } = this.state
    if (name && day_offset !== undefined && total_points !== undefined) {
      this.props.onSubmit({ name, day_offset, total_points })
      this.props.onClose()
      this.setState({
        name: undefined,
        day_offset: undefined,
        total_points: undefined
      })
    }
  }
  
  render() {
    const { name, day_offset, total_points } = this.state
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
          showSearch
          className={styles.formItem} 
          value={day_offset} 
          placeholder='Day offset'
          onChange={this.onUpdateDayOffset}
        >
          { Array.apply(null, {length: 7}).map(Number.call, Number).map(n => (
            <Option key={n} value={n}>{`${NUM_TO_DAY[n]} (${n})`}</Option>
          )) }
        </Select>
        <Select
          showSearch
          className={styles.formItem}
          value={total_points}
          placeholder='Total points'
          onChange={this.onUpdateTotalPoints}
        >
          { Array.apply(null, {length: 101}).map(Number.call, Number).map(n => (
            <Option key={n} value={n}>{n}</Option>
          )) }
        </Select>
      </Modal>
    )
  }
}
