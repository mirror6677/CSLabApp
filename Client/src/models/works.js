import { getAll, addWork, updateWork } from '../services/works'

export default {

  namespace: 'works',

  state: {},

  effects: {
    *getAll({ payload }, { call, put }) {
      const data = yield call(getAll, payload)
      if (data.data) {
        yield put({
          type: 'worksReceived',
          payload: data.data.works.reduce((result, item) => {
            result[item._id] = item
            return result
          }, {})
        })
      }
    },
    
    *addWork({ payload }, { call, put }) {
      const data = yield call(addWork, payload)
      if (data.data) {
        var res = {}
        res[data.data.work._id] = data.data.work
        yield put({
          type: 'workAdded',
          payload: res
        })
      }
    },

    *updateWork({ payload }, { call, put }) {
      const data = yield call(updateWork, payload)
      if (data.data) {
        var res = {}
        res[data.data.work._id] = data.data.work
        yield put({
          type: 'workUpdated',
          payload: res
        })
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