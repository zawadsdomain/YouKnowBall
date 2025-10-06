import { Request, Response, NextFunction } from 'express';
import { logger, generateRequestId } from '../utils/logger';

// Extend Request interface to include requestId and responseTime
declare global {
  namespace Express {
    interface Request {
      requestId: string;
      startTime: number;
    }
    interface Response {
      responseTime: number;
    }
  }
}

export const requestLoggingMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Generate unique request ID
  req.requestId = generateRequestId();
  req.startTime = Date.now();

  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any, cb?: any) {
    res.responseTime = Date.now() - req.startTime;
    logger.logRequest(req, res, res.responseTime);
    return originalEnd.call(this, chunk, encoding, cb);
  };

  next();
};

export const errorLoggingMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  // Log the error with full context
  logger.error('Unhandled error occurred', err, {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    query: req.query,
    params: req.params,
    headers: {
      'user-agent': req.get('User-Agent'),
      'content-type': req.get('Content-Type'),
      'authorization': req.get('Authorization') ? '[REDACTED]' : undefined
    }
  }, req, res);

  // Send error response
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    requestId: req.requestId,
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};
