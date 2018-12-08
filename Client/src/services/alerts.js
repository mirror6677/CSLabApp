import request from '../utils/request'

export const getAlerts = userId => {
  return request(`/alerts/user/${userId}`)
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