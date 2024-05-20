import { UUIDSchema } from '@buddy/base-utils'
import createHttpError from 'http-errors'
import { ZodObject, ZodRawShape } from 'zod'
import { logger } from './logger'

/**
 * Validates request body against Zod scheme
 * Returns HTTP 400 if Validation fails
 * @param zodScheme
 */
export function validateReqBody<T extends ZodRawShape>(zodScheme: ZodObject<T>) {
   return (req, res, next) => {
      try {
         if (Object.keys(req.body).length <= 0) throw Error('No values in request body')
         zodScheme.parse(req.body)
         next()
      } catch (e) {
         logger.error(e.message)
         throw createHttpError(400)
      }
   }
}

/**
 * Express middleware that reads url parameter id and validates wit ZOD if it is a valid UUID
 */
export function validateReqUUID(req, res, next) {
   try {
      UUIDSchema.parse(req.params.id)
      next()
   } catch (e) {
      logger.error(e.message)
      throw createHttpError(400, 'Invalid uuid')
   }
}
