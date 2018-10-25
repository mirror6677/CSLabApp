import { getAll, addCourse, updateCourse } from '../services/courses'

export default {

  namespace: 'courses',

  state: {},

  effects: {
    *getAll(_, { call, put }) {
      const data = yield call(getAll)
      if (data.data) {
        yield put({
          type: 'coursesReceived',
          payload: data.data.courses.reduce((result, item) => {
            result[item._id] = item
            return result
          }, {})
        })
      }
    },
    
    *addCourse({ payload }, { call, put }) {
      const data = yield call(addCourse, payload)
      if (data.data) {
        var res = {}
        res[data.data.course._id] = data.data.course
        yield put({
          type: 'courseAdded',
          payload: res
        })
      }
    },

    *updateCourse({ payload }, { call, put }) {
      const data = yield call(updateCourse, payload)
      if (data.data) {
        var res = {}
        res[data.data.course._id] = data.data.course
        yield put({
          type: 'courseUpdated',
          payload: res
        })
      }
    }
  },

  reducers: {
    coursesReceived(state, action) {
      return { ...state, ...action.payload }
    },

    courseAdded(state, action) {
      console.log(action.payload)
      return Object.assign({}, state, action.payload)
    },

    courseUpdated(state, action) {
      return Object.assign({}, state, action.payload)
    },

    courseDeleted(state, action) {
      // Deleting course is only changing the deleted flag to true
      return Object.assign({}, state, action.payload)
    }
  }
}