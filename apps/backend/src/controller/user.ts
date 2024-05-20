import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import createHttpError from 'http-errors'
import { encodeUUID } from '../utils/authoriztion-utils'
import { buddyDB } from '../utils/buddy-db'
import { remapKeys } from '../utils/mapper'

const userRoute = express.Router()

// creates a new Buddy-Secret for a new Profile
userRoute.post(
   '/',
   expressAsyncHandler(async (req, res) => {
      const secret = await buddyDB.tx(async (t) => {
         const result = await buddyDB.one('INSERT INTO users(id, secret) VALUES (DEFAULT, DEFAULT) RETURNING id, secret')
         await buddyDB.none('INSERT INTO app_settings(user_id) VALUES ($1)', result.id)

         return encodeUUID(result.secret)
      })

      res.send({ secret })
   })
)

// Get userdata
userRoute.get(
   '/',
   expressAsyncHandler(async (req, res) => {
      const result = await buddyDB.one('SELECT email, secret, is_full_user FROM users WHERE id=$1', res.locals.userID, (res) => ({
         ...res,
         secret: encodeUUID(res.secret),
      }))

      res.send(remapKeys(result, false))
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
