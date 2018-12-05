import request from '../utils/request'

export const getTestResult = testResultId => {
  return request(`/test_results/${testResultId}`)
}

export const addTestResult = testResult => {
  var headers = new Headers()
  headers.append("Content-Type", "application/json")
  return request(`/test_results`, {
    headers,
    method: 'post',
    body: JSON.stringify(testResult)
  })
}