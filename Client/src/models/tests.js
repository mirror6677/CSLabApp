import { getTest, addTest, updateTest, getFiles, getSolutionFiles } from '../services/tests'
import TEST_CATEGORIES from '../constants/test_categories'

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
          result[payload[i]] = data.data.test
        }
      }
      yield put({
        type: 'testsReceived',
        payload: result
      })
      const testIds = Object.keys(result)
      for (i = 0; i < testIds.length; i++) {
        if (result[testIds[i]].category === TEST_CATEGORIES.BLACKBOX) {
          yield put({
            type: 'getFiles',
            payload: testIds[i]
          })
          yield put({
            type: 'getSolutionFiles',
            payload: testIds[i]
          })
        }
      }
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

    *addTest({ payload }, { call, put }) {
      const data = yield call(addTest, payload.test)
      if (data.data) {
        yield put({
          type: 'testReceived',
          payload: data.data.test
        })
        payload.callback && payload.callback(data.data.test)
      }
    },

    *updateTest({ payload }, { call, put }) {
      const data = yield call(updateTest, payload.test)
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
          payload: { 
            files: data.data.files.map(file => file.Key.split('/', 3)[2]), 
            testId: payload 
          }
        })
      }
    },

    *getSolutionFiles({ payload }, { call, put }) {
      const data = yield call(getSolutionFiles, payload)
      if (data.data) {
        yield put({
          type: 'solutionFilesReceived',
          payload: { 
            solutionFiles: data.data.files.map(file => file.Key.split('/', 3)[2]), 
            testId: payload
          }
        })
      }
    },

    *removeFile({ payload }, { call, put }) {
      //TODO: ability to remove file from server storage or s3
    }
  },

  reducers: {
    testsReceived(state, action) {
      return { tests: action.payload, files: {}, solutionFiles: {} }
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