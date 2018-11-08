import { getAll, getFile, removeFile } from '../services/files'

export default {

  namespace: 'files',

  state: {},

  effects: {
    *getAll({ payload }, { call, put }) {
      var result = {}
      for (var i = 0; i < payload.length; i++) {
        const data = yield call(getAll, payload[i])
        if (data.data) {
          result[payload[i]] = data.data.files.reduce((result, item) => {
            result[item.Key.split('/', 2)[1]] = item
            return result
          }, {})
        }
      }
      yield put({
        type: 'filesReceived',
        payload: result
      })
    },

    *getFile({ payload }, { call, put }) {
      const { workId, filename } = payload
      const data = yield call(getFile, workId, filename)
      if (data.data) {
        const { ContentType, Body } = data.data.file
        if (ContentType.split('/', 2)[0] === 'text') {
          const fileData = {
            ContentType,
            Body: Body.data.map(c => String.fromCharCode(c)).join('')
          }
          yield put({
            type: 'fileUpdated',
            payload: {
              ...payload,
              fileData
            }
          })
        }
      }
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

    fileUploaded(state, action) {
      const { workId, filename } = action.payload
      const work = {
        ...state[workId],
        [filename]: {
          Key: `${workId}/${filename}`
        }
      }
      return {
        ...state,
        [workId]: work
      }
    },

    fileUpdated(state, action) {
      const { workId, filename, fileData } = action.payload
      if (state[workId] && state[workId][filename]) {
        const work = {
          ...state[workId],
          [filename]: {
            ...state[workId][filename],
            ...fileData
          }
        }
        return {
          ...state,
          [workId]: work
        }
      }
    },

    fileRemoved(state, action) {
      const { workId, filename } = action.payload
      return { 
        ...state, 
        [workId]: Object.keys(state[workId]).filter(f => f !== filename).reduce((result, item) => {
          result[item] = state[workId][item]
          return result
        }, {}) 
      }
    }
  }
}