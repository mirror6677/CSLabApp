import { getAssignment, addAssignment, updateAssignment } from '../services/assignments'

export default {

  namespace: 'assignments',

  state: {},

  effects: {
    *getAll({ payload }, { call, put }) {
      var res = {}
      var problem_ids = []
      for (var i = 0; i < payload.length; i++) {
        const data = yield call(getAssignment, payload[i])
        if (data.data) {
          res[data.data.assignment._id] = data.data.assignment
          problem_ids = [...problem_ids, ...data.data.assignment.problems]
        }
      }
      yield put({
        type: 'assignmentsReceived',
        payload: res
      })
      yield put({
        type: 'problems/getAll',
        payload: problem_ids
      })
    },
    
    *addAssignment({ payload }, { call, put }) {
      const data = yield call(addAssignment, payload.courseId, payload.assignment)
      if (data.data) {
        var assignmentRes = {}
        assignmentRes[data.data.assignment._id] = data.data.assignment
        yield put({
          type: 'assignmentAdded',
          payload: assignmentRes
        })
        yield put({
          type: 'course/courseUpdated',
          payload: data.data.course
        })
        var courseRes = {}
        courseRes[data.data.course._id] = data.data.course
        yield put({
          type: 'courses/courseUpdated',
          payload: courseRes
        })
      }
    },

    *updateAssignment({ payload }, { call, put }) {
      const data = yield call(updateAssignment, payload)
      if (data.data) {
        var res = {}
        res[data.data.assignment._id] = data.data.assignment
        yield put({
          type: 'assignmentUpdated',
          payload: res
        })
      }
    }
  },

  reducers: {
    assignmentsReceived(_, action) {
      // replace all current assignments with the new ones to clean up memory
      return { ...action.payload }
    },

    assignmentAdded(state, action) {
      return Object.assign({}, state, action.payload)
    },

    assignmentUpdated(state, action) {
      return Object.assign({}, state, action.payload)
    }
  }
}