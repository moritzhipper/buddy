import { environment } from '@buddy/base-utils'
import pgPromise from 'pg-promise'
import pino from 'pino'
import webpush from 'web-push'

// database
const pgp = pgPromise()
const buddyConnection = `postgres://${environment.dbUser}:${environment.dbPW}@${environment.host}:${environment.dbPort}/buddy`
const buddyDB = pgp(buddyConnection)

// logger
const logger = pino({ level: environment.logLevel })

// setup push service
const buddyWebpush = webpush
buddyWebpush.setVapidDetails('https://localhost:4200/list', environment.vapidKeyPublic, environment.vapidKeyPrivate)

export { buddyDB, buddyWebpush, logger }
