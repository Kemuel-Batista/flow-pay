import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

import { logger } from '@/infra/config/winston-config'

@Injectable()
export class WinstonLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      const statusCode = res.statusCode
      if (
        statusCode !== 200 &&
        statusCode !== 201 &&
        statusCode !== 203 &&
        statusCode !== 204
      ) {
        const body = { ...req.body }
        delete body.password
        delete body.passwordConfirmation
        const user = (req as any).user
        const userEmail = user ? user.email : null
        logger.warn({
          timestamp: new Date().toISOString(),
          method: req.method,
          route: req.route.path,
          statusCode: res.statusCode,
          data: {
            body,
            query: req.query,
            params: req.params,
          },
          from: req.ip,
          madeBy: userEmail,
        })
      }
    })

    next()
  }
}
