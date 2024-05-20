import { UserCredentials, UserCredentialsSchema, UserEmailSchema, UserPasswordSchema } from '@buddy/base-utils'
import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import createHttpError from 'http-errors'
import { encodeUUID, getSessionIDFromRequest, getUserAuth } from '../utils/authoriztion-utils'
import { buddyDB, pgp } from '../utils/buddy-db'
import { validateReqBody } from '../utils/schema-validation'

const authRoute = express.Router()

// add BasicAuth protection for access to notes, goals and appointment functionality
authRoute.post(
   '/cred',
   validateReqBody(UserCredentialsSchema),
   expressAsyncHandler(async (req, res) => {
      const { email, password } = req.body as UserCredentials
      const userID = res.locals.userID

      await buddyDB.tx(async (t) => {
         const emailAlreadyInUse = await t.one('SELECT exists(SELECT * FROM users WHERE email=$1)', email, (result) => result.exists)
         if (emailAlreadyInUse) throw createHttpError('Email already in use')

         const userAlreadyIsSecure = await t.one('SELECT is_full_user from users where id=$1', userID, (result) => result.is_full_user)
         if (userAlreadyIsSecure) throw createHttpError(409, 'Auth via mail and password already set up')

         // delete all sessions of user
         await t.none(deleteSessionsQuery(userID))

         const updateWasSuccesfull = await t.result(
            `UPDATE users SET password=crypt($1, gen_salt('bf')), email=$2, is_full_user=true WHERE id=$3`,
            [password, email, userID],
            (result) => result.rowCount === 1
         )

         if (!updateWasSuccesfull) {
            throw createHttpError(500, 'A weird error occured.')
         }
      })

      res.send()
   })
)

// rotate Buddy-Secret
authRoute.patch(
   '/key',
   expressAsyncHandler(async (req, res) => {
      const newSecret = await buddyDB.tx(async (t) => {
         const secret = await t.one('UPDATE users SET secret=DEFAULT WHERE id=$1 returning secret', res.locals.userID, (result) => result.secret)

         await t.none(deleteSessionsQuery(res.locals.userID))

         return secret
      })

      const encodedSecret = encodeUUID(newSecret)
      res.send({ secret: encodedSecret })
   })
)

// update password
authRoute.patch(
   '/cred/password',
   validateReqBody(UserPasswordSchema),
   expressAsyncHandler(async (req, res) => {
      await buddyDB.tx(async (t) => {
         const updateSuccesfull = await buddyDB.result(
            `UPDATE users SET password=crypt($1, gen_salt('bf')) WHERE id=$2`,
            [req.body.password, res.locals.userID],
            (res) => res.rowCount === 1
         )
         if (!updateSuccesfull) throw createHttpError(500)

         await t.none(deleteSessionsQuery(res.locals.userID))
      })

      res.send()
   })
)

// update email
authRoute.patch(
   '/cred/email',
   validateReqBody(UserEmailSchema),
   expressAsyncHandler(async (req, res) => {
      await buddyDB.tx(async (t) => {
         const updateSuccesfull = await buddyDB.result(
            `UPDATE users SET email=$1 WHERE id=$2`,
            [req.body.email, res.locals.userID],
            (res) => res.rowCount === 1
         )
         if (!updateSuccesfull) throw createHttpError(500)

         await t.none(deleteSessionsQuery(res.locals.userID))
      })

      res.send()
   })
)

// create session
// when same ip, just update
authRoute.post(
   '/sessions',
   validateReqBody(UserCredentialsSchema),
   expressAsyncHandler(async (req, res) => {
      const sessionID = await buddyDB.tx(async (t) => {
         const { userID, isFullUser } = await getUserAuth(req.body as UserCredentials, t)
         const clientIp = req.ip || null

         const sessionID = await t.one('SELECT gen_random_uuid() AS session_id', null, (res) => res.session_id)

         const savingWasSuccessfull = await t.result(
            `
            INSERT INTO sessions (user_id, ip, created_by_full_user, id) 
            VALUES ($1, $2, $3, crypt($4, gen_salt('bf')))
            ON CONFLICT (ip, user_id)
            DO UPDATE SET id=crypt($4, gen_salt('bf')), created_at=DEFAULT`,
            [userID, clientIp, isFullUser, sessionID],
            (result) => result.rowCount === 1
         )

         if (savingWasSuccessfull) {
            return sessionID
         } else {
            throw createHttpError(500)
         }
      })

      res.setHeader('Set-Cookie', `sessionID=${sessionID}; Path=/; HttpOnly; Secure; SameSite=strict`)

      // TODO Keep or delete depending on how session is stored in FE (manually vs set-cookie header)
      res.send({ session: sessionID })
   })
)

// todo: test
// logout one device: delete session
authRoute.delete(
   '/sessions',
   expressAsyncHandler(async (req, res) => {
      await buddyDB.none('DELETE FROM sessions WHERE user_id=$1 and id=crypt($2, id)', [res.locals.userID, getSessionIDFromRequest(req)])

      res.send()
   })
)

// logout every device delete all sessions forcing every client to relogin
authRoute.delete(
   '/sessions/all',
   expressAsyncHandler(async (req, res) => {
      await buddyDB.none(deleteSessionsQuery(res.locals.userID))

      res.send()
   })
)

const deleteSessionsQuery = (userID) => pgp.as.format(`DELETE FROM sessions WHERE user_id=$1`, userID)

export = authRoute
