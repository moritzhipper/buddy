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
      // save subscription in DB here
      const endpoint = req.body.endpoint
      const p265dh = req.body.keys.p265dh
      const key = req.body.keys.auth

      const insert = pgp.helpers.insert({ endpoint, p265dh, key }, null, 'subscriptions')
      const saveSuccesfull = buddyDB.result(insert, [res.locals.userID, endpoint, p265dh, key], (res) => res.rowCount === 1)

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
