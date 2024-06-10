import { UserProfile, UserProfileScheme } from '@buddy/base-utils'
import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import createHttpError from 'http-errors'
import { decoodeBuddySecret, encodeBuddySecret } from '../utils/authoriztion-utils'
import { buddyDB } from '../utils/buddy-db'
import { validateReqBody, validateReqSecret } from '../utils/schema-validators'

// YjU4NTdkZDMtMjA1MC00NmM4LWI1MGEtOTA4YTIyMjgxMTEx
const profileRoute = express.Router()

// creates a new Profile
profileRoute.post(
   '/',
   expressAsyncHandler(async (req, res) => {
      const profile = await buddyDB.one<UserProfile>(
         'INSERT INTO users(id, secret, call_precaution_time) VALUES (DEFAULT, DEFAULT, DEFAULT) RETURNING secret, call_precaution_time'
      )

      res.send({ ...profile, secret: encodeBuddySecret(profile.secret) })
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

// rotates Buddy-Secret
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

// update Profile
profileRoute.patch(
   '/',
   validateReqBody(UserProfileScheme),
   expressAsyncHandler(async (req, res) => {
      const { callPrecautionTime } = req.body

      if (!callPrecautionTime) throw createHttpError(400)

      const affectedRows = await buddyDB.result(
         'UPDATE users SET call_precaution_time = $1 WHERE id=$2',
         [callPrecautionTime, res.locals.userID],
         (result) => result.rowCount
      )

      res.send()
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
