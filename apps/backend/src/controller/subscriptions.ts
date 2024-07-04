import { PushSubscriptionSchema } from '@buddy/base-utils'
import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import createHttpError from 'http-errors'
import { buddyDB } from '../utils/buddy-db'
import { logger } from '../utils/logger'
import { validateReqBody } from '../utils/schema-validators'

const subscriptionsRoute = express.Router()

subscriptionsRoute.post(
   '/',
   validateReqBody(PushSubscriptionSchema),
   expressAsyncHandler(async (req, res) => {
      const result = await buddyDB.result(
         `INSERT INTO subscriptions (user_id, subscription) VALUES ($1, $2)
         ON CONFLICT (user_id) DO UPDATE SET subscription = $2`,
         [res.locals.userID, req.body]
      )

      if (result.rowCount !== 1) throw createHttpError(500)
      res.send()
   })
)

subscriptionsRoute.delete(
   '/',
   expressAsyncHandler(async (req, res) => {
      const result = await buddyDB.result(`DELETE FROM subscriptions WHERE user_id = $1`, [res.locals.userID])
      logger.info(`${result.rowCount} rows affected by deletion`)

      res.send()
   })
)

export = subscriptionsRoute
