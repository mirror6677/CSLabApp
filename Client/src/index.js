import dva from 'dva'
import './index.css'
import user from './models/user'
import courses from './models/courses'
import roster from './models/roster'
import course from './models/course'
import assignments from './models/assignments'
import problems from './models/problems'
import works from './models/works'
import files from './models/files'
import tests from './models/tests'
import testResults from './models/testResults'
import grades from './models/grades'
import alerts from './models/alerts'

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
app.model(works)
app.model(files)
app.model(tests)
app.model(testResults)
app.model(grades)
app.model(alerts)

// 4. Router
app.router(require('./router').default)

// 5. Start
app.start('#root')
