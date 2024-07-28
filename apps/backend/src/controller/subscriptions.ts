import { PushSubscriptionSchema } from '@buddy/base-utils'
import express from 'express'
import expressAsyncHandler from 'express-async-handler'
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
         ON CONFLICT (subscription) DO UPDATE SET user_id = $1`,
         [res.locals.userID, req.body]
      )

      res.send()
   })
)

// removes notifications on every device
subscriptionsRoute.delete(
   '/',
   expressAsyncHandler(async (req, res) => {
      const result = await buddyDB.result(`DELETE FROM subscriptions WHERE user_id = $1`, [res.locals.userID])
      logger.info(`${result.rowCount} subscriptions deleted`)

      res.send()
   })
)

export = subscriptionsRoute
