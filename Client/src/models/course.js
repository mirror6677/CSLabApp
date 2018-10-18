import { getCourse, getActiveCourse } from '../services/courses'

export default {

  namespace: 'course',

  state: {},

  effects: {
    *getCourse({ payload }, { call, put }) {
      const data = yield call(getCourse, payload)
      if (data.data) {
        yield put({
          type: 'courseReceived',
          payload: data.data.course
        })
        yield put({
          type: 'assignments/getAll',
          payload: data.data.course.assignments
        })
      }
    },

    *getActiveCourse(_, { call, put }) {
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