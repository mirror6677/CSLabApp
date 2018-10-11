import React from 'react'
import { connect } from 'dva'
import { DatePicker, Input, Modal, Switch } from 'antd'
import styles from './EditModal.css'
import moment from 'moment'

class EditModal extends React.PureComponent {

  state = {
    semester: null,
    start_date: moment(),
    active: false
  }

  componentDidMount() {
    const { semester, start_date, active } = this.props.course
    this.setState({ 
      semester, 
      start_date, 
      active 
    })
  }

  onUpdateSemester = semester => {
    this.setState({ semester })
  }

  onUpdateActive = active => {
    this.setState({ active })
  }

  onSubmit = () => {
    const { semester, start_date, active } = this.state
    this.props.dispatch({
      type: 'courses/updateCourse',
      payload: {
        ...this.props.course,
        semester,
        start_date,
        active
      }
    })
    this.props.onClose()
  }
  
  render() {
    const { semester, start_date, active } = this.state
    const { visible, onClose } = this.props
    return (
      <Modal
        title={'Edit course'}
        visible={visible}
        onOk={this.onSubmit}
        onCancel={onClose}
        width={'70%'}
      >
        <DatePicker
          className={styles.formItem}
          value={moment(start_date)}
          disabled
        />
        <Input 
          className={styles.formItem}
          value={ semester }
          onChange={ e => this.onUpdateSemester(e.target.value) } 
        />
        <Switch checked={active} onChange={this.onUpdateActive} />
      </Modal>
    )
  }
}

export default connect(({ courses }) => ({
  courses
}))(EditModal)