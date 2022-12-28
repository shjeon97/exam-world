import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import * as requestIp from 'request-ip';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const clientIp = requestIp.getClientIp(request);

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} ${clientIp} - ${userAgent}`,
      );
    });

    next();
  }
}
