import { getTestResult, addTestResult } from '../services/testResults'

export default {
  namespace: 'testResults',

  state: {},

  effects: {
    *getAll({ payload }, { call, put }) {
      var result = {}
      for (var i = 0; i < payload.length; i++) {
        const data = yield call(getTestResult, payload[i])
        if (data.data) {
          result[payload[i]] = data.data.test_result
        }
      }
      yield put({
        type: 'testResultsReceived',
        payload: result
      })
    },

    *addTestResult({ payload }, { call, put }) {
      const data = yield call(addTestResult, payload.data)
      if (data.data) {
        var res = {}
        res[data.data.test_result._id] = data.data.test_result
        yield put({
          type: 'testResultAdded',
          payload: res
        })
        payload.callback && payload.callback({ data: data.data.test_result._id })
      } else {
        payload.callback && payload.callback({ err: data.err })
      }
    }
  },

  reducers: {
    testResultsReceived(_, action) {
      return { ...action.payload }
    },

    testResultAdded(state, action) {
      return { ...state, ...action.payload }
    }
  }
}