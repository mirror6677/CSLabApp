import { getAll, addWork, updateWork } from '../services/works'

export default {

  namespace: 'works',

  state: {},

  effects: {
    *getAll({ payload }, { call, put }) {
      const data = yield call(getAll, payload)
      if (data.data) {
        const payload = data.data.works.reduce((result, item) => {
          result[item._id] = item
          return result
        }, {})
        yield put({
          type: 'worksReceived',
          payload
        })
        yield put({
          type: 'files/getAll',
          payload: Object.keys(payload)
        })
      }
    },
    
    *addWork({ payload }, { call, put }) {
      const data = yield call(addWork, payload.data)
      if (data.data) {
        var res = {}
        res[data.data.work._id] = data.data.work
        yield put({
          type: 'workAdded',
          payload: res
        })
        payload.callback && payload.callback({ data: data.data.work._id})
      } else {
        payload.callback && payload.callback({ err: data.err })
      }
    },

    *updateWork({ payload }, { call, put }) {
      const data = yield call(updateWork, payload.data)
      if (data.data) {
        var res = {}
        res[data.data.work._id] = data.data.work
        yield put({
          type: 'workUpdated',
          payload: res
        })
        payload.callback && payload.callback({ data: data.data.work._id})
      } else {
        payload.callback && payload.callback({ err: data.err })
      }
    }
  },

  reducers: {
    worksReceived(_, action) {
      return { ...action.payload }
    },

    workAdded(state, action) {
      console.log(action.payload)
      return Object.assign({}, state, action.payload)
    },

    workUpdated(state, action) {
      return Object.assign({}, state, action.payload)
    }
  }
}