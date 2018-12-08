import request from '../utils/request'
import queryString from 'query-string'

export const getAll = payload => {
  const qs = queryString.stringify(payload)
  return request(`/alerts?${qs}`)
}

export const addAlert = alert => {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");
  return request('/alerts', {
    headers,
    method: 'post',
    body: JSON.stringify(alert)
  })
}

export const updateAlert = alert => {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");
  return request(`/alerts/${alert._id}`, {
    headers,
    method: 'put',
    body: JSON.stringify(alert)
  })
}