import { getProfileData, getLoggedInUser, handleLogin, handleLogout } from '../services/user'
import getUserImageUrl from '../utils/imageUrl'

export default {

  namespace: 'user',

  state: {
    name: null,
    username: null,
    image: null,
    isSignedIn: false,
    serverSession: null
  },

  effects: {
    *verifyUser(_, { call, put }) {
      const data = yield call(getLoggedInUser)
      const sessionData = data.data.session
      if (sessionData.profile) {
        const username = sessionData.profile.email.split('@')[0]
        const userData = yield call(getProfileData, username)
        if (userData) {
          console.log(userData)
          yield put({
            type: 'updateUser',
            payload: { 
              name: userData.data.Name, 
              username: userData.data.Locator,
              image: getUserImageUrl(userData.data.Locator),
              isSignedIn: true,
              serverSession: sessionData.session
            }
          })
          return
        }
      } else {
        yield put({
          type: 'updateUser',
          payload: { 
            name: null, 
            username: null,
            image: null,
            isSignedIn: false,
            serverSession: null
          }
        })
      }
    },

    *handleLogin({ payload }, { call, put }) {
      yield call(handleLogin, payload)
      yield put({ type: 'verifyUser' })
    },

    *handleLogout(_, { call, put }) {
      yield call(handleLogout)
      yield put({ type: 'verifyUser' })
    }
  },

  reducers: {
    updateUser(state, action){
      return { ...state, ...action.payload }
    }
  }
}