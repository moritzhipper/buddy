import { BuddyRoutes } from '@buddy/base-utils'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Express } from 'express'
import profileRoute from './controller/profile'
import therapistsRoute from './controller/therapists'
import { authorize } from './utils/authoriztion-utils'
import { testDBConnection } from './utils/buddy-db'
import environment from './utils/environment-adapter'
import { errorHandler } from './utils/error-handler'
import { logger, loggerMiddleware } from './utils/logger'
import { validateSecretFromHeaderOrCookie as validateSecret } from './utils/schema-validators'

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
app.use(validateSecret)
app.use(authorize)
app.use(BuddyRoutes.PROFILE, profileRoute)
app.use(BuddyRoutes.THERAPISTS, therapistsRoute)
app.use(errorHandler)

const server = app.listen(PORT, async () => {
   await testDBConnection()
   logger.info(`Server is running on port ${PORT}`)
})

server.on('error', console.error)
