import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import createHttpError from 'http-errors'
import { decoodeBuddySecret, encodeBuddySecret } from '../utils/authoriztion-utils'
import { buddyDB } from '../utils/buddy-db'
import { validateReqSecret } from '../utils/schema-validators'

// YjU4NTdkZDMtMjA1MC00NmM4LWI1MGEtOTA4YTIyMjgxMTEx
const profileRoute = express.Router()

// creates a new Buddy-Secret for a new Profile
profileRoute.post(
   '/',
   expressAsyncHandler(async (req, res) => {
      const secret = await buddyDB.one(
         'INSERT INTO users(id, secret, call_precaution_time) VALUES (DEFAULT, DEFAULT, DEFAULT) RETURNING secret',
         null,
         (res) => encodeBuddySecret(res.secret)
      )

      res.send({ secret })
   })
)

// reads Profile if existing
profileRoute.get(
   '/:secret',
   validateReqSecret,
   expressAsyncHandler(async (req, res) => {
      const decodedSecret = decoodeBuddySecret(req.params.secret)
      const callPrecautionTime = await buddyDB.one(
         'SELECT call_precaution_time FROM users WHERE secret = $1',
         decodedSecret,
         (res) => res.callPrecautionTime
      )

      res.send({ callPrecautionTime })
   })
)

// rotate Buddy-Secret
profileRoute.patch(
   '/key',
   expressAsyncHandler(async (req, res) => {
      const newSecret = await buddyDB.one(
         'UPDATE users SET secret=DEFAULT WHERE id=$1 returning secret',
         res.locals.userID,
         (result) => result.secret
      )

      const encodedSecret = encodeBuddySecret(newSecret)
      res.send({ secret: encodedSecret })
   })
)

// delete account
profileRoute.delete(
   '/',
   expressAsyncHandler(async (req, res) => {
      let deletedEntryCount = await buddyDB.result('DELETE FROM users WHERE id=$1', res.locals.userID, (result) => result.rowCount)

      if (deletedEntryCount === 0) throw createHttpError(500, 'User not found or already deleted.')

      res.send()
   })
)

export = profileRoute
