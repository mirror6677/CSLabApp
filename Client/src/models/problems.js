import { getProblem, addProblem, updateProblem } from '../services/problems'

export default {

  namespace: 'problems',

  state: {},

  effects: {
    *getAll({ payload }, { call, put }) {
      var res = {}
      var test_ids = []
      for (var i = 0; i < payload.length; i++) {
        const data = yield call(getProblem, payload[i])
        if (data.data) {
          res[data.data.problem._id] = data.data.problem
          test_ids = [...test_ids, ...data.data.problem.tests]
        }
      }
      yield put({
        type: 'problemsReceived',
        payload: res
      })
      yield put({
        type: 'tests/getAll',
        payload: test_ids
      })
    },
    
    *addProblem({ payload }, { call, put }) {
      const data = yield call(addProblem, payload.assignmentId, payload.problem)
      if (data.data) {
        var problemRes = {}
        problemRes[data.data.problem._id] = data.data.problem
        yield put({
          type: 'problemAdded',
          payload: problemRes
        })
        var assignmentRes = {}
        assignmentRes[data.data.assignment._id] = data.data.assignment
        yield put({
          type: 'assignments/assignmentUpdated',
          payload: assignmentRes
        })
      }
    },

    *updateProblem({ payload }, { call, put }) {
      const data = yield call(updateProblem, payload)
      if (data.data) {
        var res = {}
        res[data.data.problem._id] = data.data.problem
        yield put({
          type: 'problemUpdated',
          payload: res
        })
      }
    }
  },

  reducers: {
    problemsReceived(_, action) {
      // replace all current problems with the new ones to clean up memory
      return { ...action.payload }
    },

    problemAdded(state, action) {
      return Object.assign({}, state, action.payload)
    },

    problemUpdated(state, action) {
      return Object.assign({}, state, action.payload)
    }
  }
}