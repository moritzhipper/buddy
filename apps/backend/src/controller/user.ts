import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import createHttpError from 'http-errors'
import { encodeBuddySecret } from '../utils/authoriztion-utils'
import { buddyDB } from '../utils/buddy-db'

const userRoute = express.Router()

// creates a new Buddy-Secret for a new Profile
userRoute.post(
   '/',
   expressAsyncHandler(async (req, res) => {
      const secret = await buddyDB.one('INSERT INTO users(id, secret) VALUES (DEFAULT, DEFAULT) RETURNING secret', null, (res) =>
         encodeBuddySecret(res.secret)
      )

      res.send({ secret })
   })
)

// rotate Buddy-Secret
userRoute.patch(
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
userRoute.delete(
   '/',
   expressAsyncHandler(async (req, res) => {
      let deletedEntryCount = await buddyDB.result('DELETE FROM users WHERE id=$1', res.locals.userID, (result) => result.rowCount)

      if (deletedEntryCount === 0) throw createHttpError(500, 'User not found or already deleted.')

      res.send()
   })
)

export = userRoute
