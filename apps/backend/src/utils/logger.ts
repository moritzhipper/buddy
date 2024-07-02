import { NextFunction, Request, Response } from 'express'
import pino from 'pino'
import { environment } from './environment'

export const logger = pino({ level: environment.logLevel })

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
   if (logger.isLevelEnabled('trace')) {
      logger.trace(req)
   } else {
      const { path, method, body } = req
      logger.debug({ path, method, body })
   }

   next()
}
