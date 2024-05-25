import { BuddyRoutes, BuddySecretSchema } from '@buddy/base-utils'
import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import { buddyDB } from './buddy-db'

/**
 * Authorization Middleware does following:
 * - Skip authentification on route used to create initial auth key for auth key creation
 * - Check if user with secret exists
 */
export async function authorize(req: Request, res: Response, next: NextFunction) {
   const isCreateProfileRequest = req.path === BuddyRoutes.PROFILE && req.method === 'POST'
   const isLoadProfileRequest = req.path.startsWith(BuddyRoutes.PROFILE) && req.method === 'GET'

   const secret = getSecretFromRequest(req)

   if (!isCreateProfileRequest && !secret && !isLoadProfileRequest) {
      console.log(req)
      return next(createHttpError(401))
   }

   if (isCreateProfileRequest || isLoadProfileRequest) {
      return next()
   }

   try {
      res.locals.userID = await getUserIDviaSecret(secret)

      return next()
   } catch (e) {
      console.error(e)
      return next(createHttpError(401, 'No secret found in request'))
   }
}

/**
 * @param sessionID
 * @returns userAuth
 */
async function getUserIDviaSecret(secret: string): Promise<string> {
   const decodedSecret = decoodeBuddySecret(secret)
   const userID = await buddyDB.oneOrNone(`SELECT id FROM users WHERE secret = $1`, decodedSecret, (res) => res.id)

   if (!userID) throw createHttpError(401)

   return userID
}

export function getSecretFromRequest(req: Request): string {
   return req.cookies.secret || req.get('secret')
}

export function decoodeBuddySecret(encodedSecret: string): string {
   const buddySecretDecoded = BuddySecretSchema.parse(encodedSecret)
   return Buffer.from(buddySecretDecoded, 'base64url').toString()
}

export function encodeBuddySecret(uuid: string): string {
   return Buffer.from(uuid).toString('base64url')
}
