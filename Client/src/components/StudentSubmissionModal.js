import React from 'react'
import { connect } from 'dva'
import { Button, Icon, Modal, Upload, message } from 'antd'
import { API_ROOT } from '../constants/routes'

const Dragger = Upload.Dragger

class StudentSubmissionModal extends React.PureComponent {

  state = {
    fileList: []
  }

  componentDidMount() {
    const { files, workId } = this.props

    if (workId && files[workId]) {
      this.setState({
        fileList: files[workId].map(file => ({
          uid: file,
          name: file,
          status: 'done',
          url: `${API_ROOT}/files/download/${workId}/${file}`
        }))
      })
    }
  }

  render() {
    const { visible, loading, workId, onSubmit, onClose } = this.props

    const draggerProps = {
      name: 'file',
      multiple: true,
      action: `${API_ROOT}/files/upload/${workId}`,
      onChange: info => {
        const { status, name } = info.file
        if (status === 'done') {
          message.success(`${name} file uploaded successfully.`)
          this.props.dispatch({
            type: 'files/fileUploaded',
            payload: {
              workId: workId,
              filename: name
            }
          })
        } else if (status === 'error') {
          message.error(`${name} file upload failed.`)
        } else if (status === 'removed') {
          this.props.dispatch({
            type: 'files/removeFile',
            payload: {
              workId,
              filename: name
            }
          })
        }
        const fileList = info.fileList.map(file => {
          if (file.status === 'done' && !file.url) {
            file.url = `${API_ROOT}/files/download/${workId}/${file.name}`
          }
          return file
        })
        this.setState({ fileList })
      },
      fileList: this.state.fileList
    }

    return (
      <Modal
        title={'Edit submission'}
        visible={visible}
        onOk={onSubmit}
        onCancel={onClose}
        maskClosable={false}
        footer={[
          <Button key='close' onClick={onClose}>Close</Button>,
          <Button key='submit' type='primary' loading={loading} onClick={onSubmit}>Submit</Button>
        ]}
      >
        <Dragger {...draggerProps}>
          <p className='ant-upload-drag-icon'>
            <Icon type='inbox' />
          </p>
          <p className='ant-upload-text'>Click or drag files to this area to upload</p>
          <p className='ant-upload-hint'>By uploading your files here, you acknowledge that they reflect your original work and all references are properly cited</p>
        </Dragger>
      </Modal>
    )
  }
}

export default connect(({ files }) => ({
  files: Object.keys(files).reduce((result, item) => {
    result[item] = Object.keys(files[item])
    return result
  }, {})
}))(StudentSubmissionModal)