import dva from 'dva'
import './index.css'
import user from './models/user'
import courses from './models/courses'
import roster from './models/roster'
import course from './models/course'
import assignments from './models/assignments'
import problems from './models/problems'

// 1. Initialize
const app = dva()

// 2. Plugins
// app.use({})

// 3. Model
app.model(user)
app.model(courses)
app.model(roster)
app.model(course)
app.model(assignments)
app.model(problems)

// 4. Router
app.router(require('./router').default)

// 5. Start
app.start('#root')
