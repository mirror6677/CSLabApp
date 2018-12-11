import request from '../utils/request'

export const getAll = () => {
  return request('/courses')
}

export const getCourse = courseId => {
  return request(`/courses/${courseId}`)
}

export const getActiveCourse = () => {
  return request(`/course/getActiveCourse`)
}

export const addCourse = course => {
  var headers = new Headers()
  headers.append("Content-Type", "application/json")
  return request('/courses', {
    headers,
    method: 'post',
    body: JSON.stringify(course)
  })
}

export const cloneCourse = (course, cloneFrom) => {
  var headers = new Headers()
  headers.append("Content-Type", "application/json")
  return request(`/courses/clone/${cloneFrom}`, {
    headers,
    method: 'post',
    body: JSON.stringify(course)
  })
}

export const updateCourse = course => {
  var headers = new Headers()
  headers.append("Content-Type", "application/json")
  return request(`/courses/${course._id}`, {
    headers,
    method: 'put',
    body: JSON.stringify(course)
  })
}

export const deleteCourse = courseId => {
  return request(`/courses/${courseId}`, {
    method: 'delete'
  })
}
