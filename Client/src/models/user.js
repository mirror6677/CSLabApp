import { getLoggedInUser, handleLogin, handleLogout, getProfileData, getUserData } from '../services/user'
import getUserImageUrl from '../utils/imageUrl'

export default {

  namespace: 'user',

  state: {
    id: null,
    name: null,
    username: null,
    image: null,
    isSignedIn: false,
    isAdmin: false,
    serverSession: null
  },

  effects: {
    *verifyUser(_, { call, put }) {
      const data = yield call(getLoggedInUser)
      const sessionData = data.data.session
      if (sessionData.profile) {
        const username = sessionData.profile.email.split('@')[0]
        const userData = yield call(getUserData, username)
        if (userData.data.user) {
          const profileData = yield call(getProfileData, username)
          if (profileData.data) {
            yield put({
              type: 'updateUser',
              payload: { 
                id: userData.data.user._id,
                name: profileData.data.Name, 
                username: username,
                image: getUserImageUrl(username),
                isSignedIn: true,
                isAdmin: userData.data.user.admin,
                serverSession: sessionData.session
              }
            })
            return
          }
        }
      } 
      // Otherwise, reset user data
      yield put({
        type: 'updateUser',
        payload: { 
          id: null,
          name: null, 
          username: null,
          image: null,
          isSignedIn: false,
          isAdmin: false,
          serverSession: null
        }
      })
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