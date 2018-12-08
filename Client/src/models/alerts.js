import { getAll, addAlert, updateAlert } from '../services/alerts'
import { sortAlerts } from '../utils/sort'
import ALERT_CATEGORIES from '../constants/alert_categories'

export default {
  namespace: 'alerts',

  state: [],

  effects: {
    *getAll({ payload }, { call, put }) {
      const data = yield call(getAll, payload.data)
      if (data.data) {
        yield put({
          type: 'alertsReceived',
          payload: data.data.alerts.sort(sortAlerts)
        })
      }
    },

    *createRegradeRequest({ payload }, { call }) {
      const { message, work } = payload.data
      const alert = {
        user: work.graded_by,
        course: work.course,
        category: ALERT_CATEGORIES.REGRADE.key,
        message,
        entity: work._id
      }
      const data = yield call(addAlert, alert)
      payload.callback && payload.callback(data)
    },

    *updateAlert({ payload }, { call, put }) {
      const data = yield call(updateAlert, payload.data)
      if (data.data) {
        yield put({
          type: 'alertUpdated',
          payload: data.data.alert
        })
        payload.callback && payload.callback({ data: data.data.alert._id })
      } else {
        payload.callback && payload.callback({ err: data.err })
      }
    }
  },

  reducers: {
    alertsReceived(_, action) {
      return { ...action.payload }
    },
    
    alertUpdated(state, action) {
      var newState = []
      state.forEach(alert => {
        if (alert._id === action.payload._id) {
          newState.push(action.payload)
        } else {
          newState.push(alert)
        }
      })
      return newState
    }
  }
}