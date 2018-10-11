import request from '../utils/request'

export const getUser = userId => {
  return request(`/users/${userId}`)
}

export const getUserByUsername = username => {
  return request(`/users/username/${username}`)
}

export const addUser = user => {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");
  return request(`/users`, {
    headers,
    method: 'post',
    body: JSON.stringify(user)
  })
}
