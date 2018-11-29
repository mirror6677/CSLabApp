import request from '../utils/request'

export const getTest = testId => {
  return request(`/tests/${testId}`)
}

export const getFiles = testId => {
  return request(`/testfiles/${testId}`)
}

export const getSolutionFiles = testId => {
  return request(`/testfiles/solution/${testId}`)
}
