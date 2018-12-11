import { getAll, addCourse, updateCourse, cloneCourse } from '../services/courses'

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

    *cloneCourse({ payload }, { call, put }) {
      const { cloneFrom, ...course } = payload
      const data = yield call(cloneCourse, course, cloneFrom)
      console.log(data)                                                           
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
    },

    *switchCourse({ payload }, { put }) {
      yield put({
        type: 'assignments/assignmentsReceived',
        payload: {}
      })
      yield put({
        type: 'problems/problemsReceived',
        payload: {}
      })
      yield put({
        type: 'tests/testsReceived',
        payload: {}
      })
      yield put({
        type: 'works/worksReceived',
        payload: {}
      })
      yield put({
        type: 'files/filesReceived',
        payload: {}
      })
      yield put({
        type: 'testResults/testResultsReceived',
        payload: {}
      })
      yield put({
        type: 'alerts/alertsReceived',
        payload: []
      })
      payload && payload()
    }
  },

  reducers: {
    coursesReceived(state, action) {
      return { ...state, ...action.payload }
    },

    courseAdded(state, action) {
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