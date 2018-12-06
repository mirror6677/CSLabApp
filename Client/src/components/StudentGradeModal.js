import React from 'react'
import { connect } from 'dva'
import { Button, Icon, Input, Modal, Table } from 'antd'
import styles from './StudentGradeModal.css'
import { API_ROOT } from '../constants/routes'
import filesize from 'filesize'

const { TextArea } = Input

class StudentGradeModal extends React.PureComponent {

  downloadFile = filename => {
    window.open(`${API_ROOT}/files/download/${this.props.work._id}/${filename}`, '_blank').focus()
  }
  
  render() {
    const { visible, work, totalPoints, onClose, files } = this.props

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
          <Button key='close' onClick={onClose}>Close</Button>,
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