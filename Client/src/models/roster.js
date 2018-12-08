import { getUser, getUserByUsername, addUser } from '../services/roster'
import { getProfileData } from '../services/user'
import { updateCourse } from '../services/courses'

export default {

  namespace: 'roster',

  state: {
  },

  effects: {
    *loadRoster({ payload }, { call, put }) {
      var res = {}
      for (var i = 0; i < payload.length; i++) {
        const data = yield call(getUser, payload[i])
        if (data.data === null) {
          continue
        }
        const userData = yield call(getProfileData, data.data.user.username)
        res[payload[i]] = {
          name: userData.data.Name, 
          username: userData.data.Locator
        }
      }
      yield put({
        type: 'rosterDataLoaded',
        payload: res
      })
    },

    *updateCourseRoster({ payload }, { call, put }) {
      const { professors, TAs, students, course } = payload
      var userDict = {}
      const users = [...professors, ...TAs, ...students]
      for (var i = 0; i < users.length; i++) {
        const username = users[i]
        const data = yield call(getUserByUsername, username)
        if (data.data.user === null) {
          // user not in db, then add to db
          const newUser = yield call(addUser, { username })
          userDict[username] = newUser.data.user._id
        } else {
          userDict[username] = data.data.user._id
        }
      }
      professors.forEach(username => {
        course.professors.push(userDict[username])
      })
      TAs.forEach(username => {
        course.TAs.push(userDict[username])
      })
      students.forEach(username => {
        course.students.push(userDict[username])
      })

      // Check duplicates
      userDict = {}
      i = 0
      while (i < course.professors.length) {
        if (userDict[course.professors[i]]) {
          course.professors.splice(i, 1)
        } else {
          userDict[course.professors[i]] = true
          i++
        }
      }
      i = 0
      while (i < course.TAs.length) {
        if (userDict[course.TAs[i]]) {
          course.TAs.splice(i, 1)
        } else {
          userDict[course.TAs[i]] = true
          i++
        }
      }
      i = 0
      while (i < course.students.length) {
        if (userDict[course.students[i]]) {
          course.students.splice(i, 1)
        } else {
          userDict[course.students[i]] = true
          i++
        }
      }
      const data = yield call(updateCourse, course)
      var res = {}
      res[data.data.course._id] = data.data.course
      yield put({
        type: 'courses/courseUpdated',
        payload: res
      })
    },

    *deleteUserFromRoster({ payload }, { call, put }) {
      const data = yield call(updateCourse, payload)
      var res = {}
      res[data.data.course._id] = data.data.course
      yield put({
        type: 'courses/courseUpdated',
        payload: res
      })
    }
  },

  reducers: {
    rosterDataLoaded(state, action) {
      return { ...state, ...action.payload }
    }
  }
}