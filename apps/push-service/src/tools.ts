import { getEnvironmentKeys } from '@buddy/base-utils'
import pgPromise from 'pg-promise'
import pino from 'pino'
import webpush from 'web-push'

// environment
const env = getEnvironmentKeys(process.env)

// database
const pgp = pgPromise()
const buddyConnection = `postgres://${env.dbUser}:${env.dbPW}@${env.host}:${env.dbPort}/buddy`
const buddyDB = pgp(buddyConnection)

// logger
const logger = pino({ level: env.logLevel })

// setup push service
// todo: hier emai rein? muss ich noch rausfinden
const buddyWebpush = webpush
buddyWebpush.setVapidDetails('https://localhost:4200/list', env.vapidKeyPublic, env.vapidKeyPrivate)

export { buddyDB, buddyWebpush, logger }
