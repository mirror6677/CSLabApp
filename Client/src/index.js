import dva from 'dva'
import './index.css'
import user from './models/user'
import courses from './models/courses'
import roster from './models/roster'

// 1. Initialize
const app = dva()

// 2. Plugins
// app.use({})

// 3. Model
app.model(user)
app.model(courses)
app.model(roster)

// 4. Router
app.router(require('./router').default)

// 5. Start
app.start('#root')
