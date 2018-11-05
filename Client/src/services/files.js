import request from '../utils/request'

export const getAll = workId => {
  return request(`/files/${workId}`)
}

export const getFile = (workId, filename) => {
  return request(`files/${workId}/${filename}`)
}

export const removeFile = key => {
  return request(`/files/remove/${key}`, {
    method: 'post'
  })
}
