import { PushSubscriptionSchema } from '@buddy/base-utils'
import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import createHttpError from 'http-errors'
import { buddyDB, pgp } from '../utils/buddy-db'
import { validateReqBody } from '../utils/schema-validators'

const subscriptionsRoute = express.Router()

subscriptionsRoute.post(
   '/',
   validateReqBody(PushSubscriptionSchema),
   expressAsyncHandler(async (req, res) => {
      const insert = pgp.helpers.insert({ user_id: res.locals.userID, subscription: req.body }, null, 'subscriptions')
      const saveSuccesfull = buddyDB.result(insert, null, (res) => res.rowCount === 1)

      if (saveSuccesfull) {
         res.send()
      } else {
         throw createHttpError(500)
      }
   })
)

subscriptionsRoute.delete(
   '/',
   expressAsyncHandler(async (req, res) => {
      // delete subscriptions here

      res.send()
   })
)

export = subscriptionsRoute
