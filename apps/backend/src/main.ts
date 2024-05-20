import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Express } from 'express'
import { authorize } from './authoriztion-utils'
import { testDBConnection } from './buddy-db'
import environment from './environment-adapter'
import { errorHandler } from './error-handler'
import { logger, loggerMiddleware } from './logger'
import appointmentsRoute from './routes/appointments'
import authRoute from './routes/auth'
import goalsRoute from './routes/goals'
import notesRoute from './routes/notes'
import { Routes } from './routes/route-names'
import settingsRoute from './routes/settings'
import therapistsRoute from './routes/therapists'
import userRoute from './routes/user'

const app: Express = express()
const PORT = environment.port
const ENVIRONMENT = environment.nodeEnv

app.use(compression())
app.use(express.json())
app.use(cookieParser())

logger.info(`Environment is ${environment.nodeEnv}`)

if (ENVIRONMENT === 'development') {
   app.use(cors({ origin: /^http:\/\/localhost:(4200|8080)$/ }))
   logger.info('Enable CORS')
}

app.use(loggerMiddleware)
app.use(authorize)
app.use(Routes.USER, userRoute)
app.use(Routes.THERAPISTS, therapistsRoute)
app.use(Routes.SETTINGS, settingsRoute)
app.use(Routes.NOTES, notesRoute)
app.use(Routes.GOALS, goalsRoute)
app.use(Routes.APPOINTMENTS, appointmentsRoute)
app.use(Routes.AUTH, authRoute)
app.use(errorHandler)

const server = app.listen(PORT, async () => {
   await testDBConnection()
   logger.info(`Server is running on port ${PORT}`)
})

server.on('error', console.error)
