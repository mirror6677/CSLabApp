import { getAll, removeFile } from '../services/files'

export default {

  namespace: 'files',

  state: {},

  effects: {
    *getAll({ payload }, { call, put }) {
      var result = {}
      for (var i = 0; i < payload.length; i++) {
        const data = yield call(getAll, payload[i])
        if (data.data) {
          const filenames = data.data.files.map(file => file.Key.split('/', 2)[1])
          result[payload[i]] = filenames
        }
      }
      yield put({
        type: 'filesReceived',
        payload: result
      })
    },

    *removeFile({ payload }, { call, put }) {
      const { workId, filename } = payload
      const data = yield call(removeFile, `${workId}/${filename}`)
      if (data.data) {
        yield put({
          type: 'fileRemoved', 
          payload
        })
      }
    }
  },

  reducers: {
    filesReceived(_, action) {
      return { ...action.payload }
    },

    fileRemoved(state, action) {
      const { workId, filename } = action.payload
      return { ...state, workId: state[workId].filter(f => f !== filename) }
    }
  }
}