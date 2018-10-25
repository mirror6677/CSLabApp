import request from '../utils/request'
import queryString from 'query-string'

export const getAll = payload => {
  const qs = queryString.stringify(payload)
  return request(`/works?${qs}`)
}

export const getWork = workId => {
  return request(`/works/${workId}`)
}

export const addWork = work => {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");
  return request('/works', {
    headers,
    method: 'post',
    body: JSON.stringify(work)
  })
}

export const updateWork = work => {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");
  return request(`/works/${work._id}`, {
    headers,
    method: 'put',
    body: JSON.stringify(work)
  })
}

export const deleteWork = workId => {
  return request(`/works/${workId}`, {
    method: 'delete'
  })
}
