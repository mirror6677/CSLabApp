import request, { base_request } from '../utils/request'
import BUCKNELL_API_TOKEN from '../../credentials/bucknell_api_token'
import { BUCKNELL_API } from '../constants/routes'

export const getLoggedInUser = () => {
  return request('/', { credentials: 'include' })
}

export const getProfileData = username => {
  return base_request(`${BUCKNELL_API}/data/person/${username}?access_token=${BUCKNELL_API_TOKEN}`)
}

export const handleLogin = token => {
  console.log(token)
  return request('/login', {
    method: 'post',
    body: JSON.stringify({ token }),
    headers: {
      "Content-Type": "application/json"
    },
    credentials: 'include'
  })
}

export const handleLogout = () => {
  return request('/logout', {
    method: 'post',
    credentials: 'include'
  })
}