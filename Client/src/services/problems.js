import request from '../utils/request'

export const getAll = () => {
  return request('/problems')
}

export const getProblem = problemId => {
  return request(`/problems/${problemId}`)
}

export const addProblem = (assignmentId, problem) => {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");
  return request(`/problems/${assignmentId}`, {
    headers,
    method: 'post',
    body: JSON.stringify(problem)
  })
}

export const updateProblem = problem => {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");
  return request(`/problems/${problem._id}`, {
    headers,
    method: 'put',
    body: JSON.stringify(problem)
  })
}

export const deleteProblem = problemId => {
  return request(`/problems/${problemId}`, {
    method: 'delete'
  })
}
