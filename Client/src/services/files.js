import request from '../utils/request'

export const getAll = workId => {
  return request(`/files/${workId}`)
}

export const removeFile = key => {
  return request(`/files/remove/${key}`, {
    method: 'post'
  })
}
