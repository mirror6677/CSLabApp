import { getCourse, getActiveCourse } from '../services/courses'

export default {

  namespace: 'course',

  state: {},

  effects: {
    *getCourse({ payload }, { call, put }) {
      const { course, student } = payload
      const data = yield call(getCourse, course)
      if (data.data) {
        yield put({
          type: 'courseReceived',
          payload: data.data.course
        })
        yield put({
          type: 'assignments/getAll',
          payload: data.data.course.assignments
        })
        yield put({
          type: 'works/getAll',
          payload: { course, student }
        })
        yield put({
          type: 'alerts/getAll',
          payload: { course, user: student }
        })
      }
    },

    *getActiveCourse({ payload }, { call, put }) {
      const data = yield call(getActiveCourse)
      if (data.data) {
        yield put({
          type: 'courseReceived',
          payload: data.data.course
        })
        yield put({
          type: 'assignments/getAll',
          payload: data.data.course.assignments
        })
        yield put({
          type: 'works/getAll',
          payload: { course: data.data.course._id, student: payload.student }
        })
        yield put({
          type: 'alerts/getAll',
          payload: { course: data.data.course._id, user: payload.student }
        })
      }
    }
  },

  reducers: {
    courseReceived(_, action) {
      return { ...action.payload }
    },

    courseUpdated(_, action) {
      return { ...action.payload }
    }
  }
}