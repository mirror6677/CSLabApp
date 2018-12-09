import React from 'react'
import { connect } from 'dva'
import { Button, Checkbox, Input, Modal, message } from 'antd'
import styles from './RegradeModal.css'
import TAGradingModal from './TAGradingModal'

const { TextArea } = Input

class RegradeModal extends React.PureComponent {

  state = {
    showGradingModal: false,
    workLoading: false,
    decline: false,
    declineComment: '',
    submissionLoading: false
  }

  onOpenGradingModal = () => {
    this.setState({
      workLoading: true
    })
    this.props.dispatch({
      type: 'works/getWork',
      payload: {
        data: this.props.alert.entity,
        callback: this.onWorkLoaded
      }
    })
  }

  onWorkLoaded = resp => {
    if (resp.err) {
      message.error(resp.err)
    } else if (resp[this.props.alert.entity]) {
      this.setState({
        showGradingModal: true,
        workLoading: false
      })
    } else {
      message.error('File loading error')
    }
  }

  declineRequest = () => {
    //TODO: create and send REGRADE_DECLINED alert
  }

  onGradingSubmit = work => {
    this.setState({
      submissionLoading: true
    })
    this.props.dispatch({
      type: 'works/updateWork',
      payload: {
        data: work,
        callback: this.onGradingSubmitComplete
      }
    })
  }

  onGradingClose = () => {
    this.setState({
      showGradingModal: false
    })
    this.props.onClose()
  }

  onGradingSubmitComplete = resp => {
    this.setState({
      submissionLoading: false,
      showGradingModal: false
    })
    //TODO: create and send REGRADE_PROCESSED alert
    if (resp.data) {
      message.success('Regrade has been submitted successfully')
    } else {
      message.error(resp.err)
    }
    this.props.onClose()
  }

  getActionButton = () => {
    const { decline, workLoading } = this.state
    return decline ?
    <Button key='regrade' type='primary' onClick={this.declineRequest}>
      Decline
    </Button> : 
    <Button key='regrade' type='primary' loading={workLoading} onClick={this.onOpenGradingModal}>
      Regrade
    </Button>
  }

  render() {
    const { visible, alert, onClose, problems, works } = this.props
    const { showGradingModal, decline, declineComment, submissionLoading } = this.state

    return (
      <div>
        <Modal
          title={'Regrade request'}
          visible={visible && !showGradingModal}
          onOk={decline ? this.declineRequest : this.onOpenGradingModal}
          onCancel={onClose}
          maskClosable={false}
          footer={[
            <Button key='close' onClick={onClose}>Close</Button>,
            this.getActionButton()
          ]}
        >
          <div>
            <p>Student's comment:</p>
            <TextArea 
              disabled
              autosize={{ minRows: 2, maxRows: 5 }}
              value={alert.message}
              placeholder={'Regrade request'}
            />
            <Checkbox 
              onChange={e => this.setState({ decline: e.target.checked })}
              checked={decline}
              className={styles.form_item}
            >
              Decline request
            </Checkbox>
            { decline && <TextArea
              autosize={{ minRows: 2, maxRows: 5 }}
              value={declineComment}
              placeholder={'Reason for declining'}
              onChange={ e => this.setState({ declineComment: e.target.value }) }
              className={styles.form_item}
            /> }
          </div>
        </Modal>
        {showGradingModal && <TAGradingModal 
          visible={showGradingModal}
          loading={submissionLoading}
          work={works[alert.entity]}
          problem={problems[works[alert.entity].problem]}
          onSubmit={this.onGradingSubmit}
          onClose={this.onGradingClose}
          showNext={false}
        /> }
      </div>
    )
  }
}

export default connect(({ problems, works, alerts }) => ({
  problems,
  works,
  alerts
}))(RegradeModal)