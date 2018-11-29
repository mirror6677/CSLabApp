import { getTest, getFiles, getSolutionFiles } from '../services/tests'

export default {

  namespace: 'tests',

  state: {
    tests: {},
    files: {},
    solutionFiles: {}
  },

  effects: {
    *getAll({ payload }, { call, put }) {
      var result = {}
      for (var i = 0; i < payload.length; i++) {
        const data = yield call(getTest, payload[i])
        if (data.data) {
          result[payload[i]] = data.data.files.reduce((result, item) => {
            result[item._id] = item
            return result
          }, {})
        }
      }
      yield put({
        type: 'testsReceived',
        payload: result
      })
    },

    *getTest({ payload }, { call, put }) {
      const data = yield call(getTest, payload)
      if (data.data) {
        yield put({
          type: 'testReceived',
          payload: data.data.test
        })
      }
    },

    *getFiles({ payload }, { call, put }) {
      const data = yield call(getFiles, payload)
      if (data.data) {
        yield put({
          type: 'filesReceived',
          payload: { files: data.data.files, testId: payload }
        })
      }
    },

    *getSolutionFiles({ payload }, { call, put }) {
      const data = yield call(getSolutionFiles, payload)
      if (data.data) {
        yield put({
          type: 'solutionFilesReceived',
          payload: { solutionFiles: data.data.files, testId: payload }
        })
      }
    },

    *removeFile({ payload }, { call, put }) {
      //TODO: ability to remove file from server storage or s3
    }
  },

  reducers: {
    testsReceived(state, action) {
      return { ...state, tests: action.payload }
    },

    testReceived(state, action) {
      return { ...state, tests: { ...state.tests, [action.payload._id]: action.payload } }
    },

    filesReceived(state, action) {
      const { files, testId } = action.payload
      return { ...state, files: { ...state.files, [testId]: files } }
    },

    solutionFilesReceived(state, action) {
      const { solutionFiles, testId } = action.payload
      return { ...state, solutionFiles: { ...state.files, [testId]: solutionFiles } }
    }
  }
}