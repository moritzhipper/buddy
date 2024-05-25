import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Express } from 'express'
import { Routes } from './controller/route-names'
import therapistsRoute from './controller/therapists'
import userRoute from './controller/user'
import { authorize } from './utils/authoriztion-utils'
import { testDBConnection } from './utils/buddy-db'
import environment from './utils/environment-adapter'
import { errorHandler } from './utils/error-handler'
import { logger, loggerMiddleware } from './utils/logger'

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
app.use(errorHandler)

const server = app.listen(PORT, async () => {
   await testDBConnection()
   logger.info(`Server is running on port ${PORT}`)
})

server.on('error', console.error)
