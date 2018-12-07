import { getGrades } from '../services/grades'

export default {
  
  namespace: 'grades',

  state: {},

  effects:  {
    *getGrades({ payload }, { call, put }) {
      const data = yield call(getGrades, payload)
      if (data.data) {
        yield put({
          type: 'gradesReceived',
          payload: data.data
        })
      }
    }
  },

  reducers: {
    gradesReceived(_, action) {
      return { ...action.payload }
    }
  }
}