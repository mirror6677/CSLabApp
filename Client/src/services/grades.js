import request from '../utils/request'

export const getGrades = courseId => {
  return request(`/grades/${courseId}`)
}