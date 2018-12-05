import request from '../utils/request'

export const getTest = testId => {
  return request(`/tests/${testId}`)
}

export const addTest = test => {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");
  return request(`/tests`, {
    headers,
    method: 'post',
    body: JSON.stringify(test)
  })
}

export const updateTest = test => {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");
  return request(`/tests/${test._id}`, {
    headers,
    method: 'put',
    body: JSON.stringify(test)
  })
}

export const deleteTest = testId => {
  return request(`/tests/${testId}`, {
    method: 'delete'
  })
}

export const getFiles = testId => {
  return request(`/testfiles/${testId}`)
}

export const getSolutionFiles = testId => {
  return request(`/testfiles/solution/${testId}`)
}
