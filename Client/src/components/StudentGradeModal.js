import React from 'react'
import { connect } from 'dva'
import { Button, Icon, Input, Modal, Popconfirm, Table, message } from 'antd'
import styles from './StudentGradeModal.css'
import { API_ROOT } from '../constants/routes'
import filesize from 'filesize'

const { TextArea } = Input

class StudentGradeModal extends React.PureComponent {

  state = {
    regradeComment: ''
  }

  downloadFile = filename => {
    window.open(`${API_ROOT}/files/download/${this.props.work._id}/${filename}`, '_blank').focus()
  }

  onSubmitRegradeRequest = () => {
    const comment = this.state.regradeComment.trim()
    if (comment.length === 0) {
      message.error('You must enter a comment')
      this.setState({
        regradeComment: ''
      })
      return
    }
    this.props.dispatch({
      type: 'alerts/createRegradeRequest',
      payload: {
        data: {
          work: this.props.work,
          message: comment
        },
        callback: this.regradeRequestCreated
      }
    })
  }

  regradeRequestCreated = ({ err }) => {
    if (err) {
      message.error(err)
    } else {
      message.success('Regrade request has been sent')
    }
  }
  
  render() {
    const { visible, work, totalPoints, onClose, files } = this.props
    const { regradeComment } = this.state

    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    }, {
      title: '',
      dataIndex: 'action',
      key: 'action',
    }]
  
    const data = Object.keys(files[work._id]).map(file => ({
      key: file,
      name: file,
      size: filesize(files[work._id][file].Size),
      action: <Icon 
        type='cloud-download' 
        className={styles.download_icon} 
        onClick={() => this.downloadFile(file)} 
      />
    }))

    return (
      <Modal
        title={'Submission graded'}
        visible={visible}
        onOk={ () => {} }
        onCancel={onClose}
        style={{ top: '50px' }}
        maskClosable={false}
        footer={[
          <Popconfirm 
            key='regrade'
            title={ <span>
              Please make sure that you have a valid reason.
              <TextArea 
                className={styles.regrade_input}
                placeholder="Describe your situation here" 
                autosize={{ minRows: 2, maxRows: 5 }}
                value={regradeComment}
                onChange={ e => this.setState({ regradeComment: e.target.value }) }
              />
            </span> }
            okText='Submit'
            cancelText='Cancel'
            onConfirm={this.onSubmitRegradeRequest} 
            onCancel={ () => this.setState({ regradeComment: '' }) }
          >
            <Button>Request regrade</Button>
          </Popconfirm>,
          <Button key='close' type='primary' onClick={onClose}>Close</Button>
        ]}
      >
        <div>
          <Table 
            dataSource={data} 
            columns={columns}
            size={'small'}
            pagination={false}
          />
          <div>
            <TextArea 
              disabled
              rows={4} 
              value={work.comment}
              placeholder={'Comment'} 
              style={{ marginTop: '12pt', marginBottom: '12pt' }}
            />
            <Input 
              disabled
              value={work.grade}
              placeholder={'Grade'} 
              addonAfter={`out of ${totalPoints}`}
            />
          </div>
        </div>
      </Modal>
    )
  }
}

export default connect(({ files }) => ({
  files
}))(StudentGradeModal)