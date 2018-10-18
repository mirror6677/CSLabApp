import request from '../utils/request'

export const getAll = () => {
  return request('/assignments')
}

export const getAssignment = assignmentId => {
  return request(`/assignments/${assignmentId}`)
}

export const addAssignment = (courseId, assignment) => {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");
  return request(`/assignments/${courseId}`, {
    headers,
    method: 'post',
    body: JSON.stringify(assignment)
  })
}

export const updateAssignment = assignment => {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");
  return request(`/assignments/${assignment._id}`, {
    headers,
    method: 'put',
    body: JSON.stringify(assignment)
  })
}

export const deleteAssignment = assignmentId => {
  return request(`/assignments/${assignmentId}`, {
    method: 'delete'
  })
}
