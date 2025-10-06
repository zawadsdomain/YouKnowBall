import { Request, Response } from 'express';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  userId?: string;
  requestId?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  responseTime?: number;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  metadata?: Record<string, any>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatLogEntry(entry: LogEntry): string {
    const timestamp = entry.timestamp;
    const level = entry.level.toUpperCase().padEnd(5);
    const message = entry.message;
    
    let logLine = `[${timestamp}] ${level} ${message}`;
    
    // Add context information
    if (entry.userId) {
      logLine += ` | User: ${entry.userId}`;
    }
    if (entry.requestId) {
      logLine += ` | Request: ${entry.requestId}`;
    }
    if (entry.method && entry.url) {
      logLine += ` | ${entry.method} ${entry.url}`;
    }
    if (entry.statusCode) {
      logLine += ` | Status: ${entry.statusCode}`;
    }
    if (entry.responseTime) {
      logLine += ` | Time: ${entry.responseTime}ms`;
    }
    
    return logLine;
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, any>, req?: Request, res?: Response, error?: Error): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata
    };

    // Add request context if available
    if (req) {
      entry.userId = (req as any).user?.uid;
      entry.requestId = (req as any).requestId;
      entry.method = req.method;
      entry.url = req.originalUrl;
    }

    // Add response context if available
    if (res) {
      entry.statusCode = res.statusCode;
      entry.responseTime = (res as any).responseTime;
    }

    // Add error information if available
    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined
      };
    }

    // Format and output the log
    const formattedLog = this.formatLogEntry(entry);
    
    // Use appropriate console method based on level
    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedLog);
        if (entry.error?.stack && this.isDevelopment) {
          console.error(entry.error.stack);
        }
        break;
      case LogLevel.WARN:
        console.warn(formattedLog);
        break;
      case LogLevel.INFO:
        console.info(formattedLog);
        break;
      case LogLevel.DEBUG:
        if (this.isDevelopment) {
          console.debug(formattedLog);
        }
        break;
    }

    // In production, you might want to send logs to an external service
    // like Winston, LogRocket, Sentry, etc.
    if (!this.isDevelopment && level === LogLevel.ERROR) {
      // TODO: Send to external logging service
      // this.sendToExternalService(entry);
    }
  }

  error(message: string, error?: Error, metadata?: Record<string, any>, req?: Request, res?: Response): void {
    this.log(LogLevel.ERROR, message, metadata, req, res, error);
  }

  warn(message: string, metadata?: Record<string, any>, req?: Request, res?: Response): void {
    this.log(LogLevel.WARN, message, metadata, req, res);
  }

  info(message: string, metadata?: Record<string, any>, req?: Request, res?: Response): void {
    this.log(LogLevel.INFO, message, metadata, req, res);
  }

  debug(message: string, metadata?: Record<string, any>, req?: Request, res?: Response): void {
    this.log(LogLevel.DEBUG, message, metadata, req, res);
  }

  // Request logging helper
  logRequest(req: Request, res: Response, responseTime: number): void {
    const level = res.statusCode >= 400 ? LogLevel.ERROR : 
                 res.statusCode >= 300 ? LogLevel.WARN : LogLevel.INFO;
    
    const message = `${req.method} ${req.originalUrl}`;
    const metadata = {
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress,
      contentLength: res.get('Content-Length')
    };

    this.log(level, message, metadata, req, res);
  }
}

// Export singleton instance
export const logger = new Logger();

// Helper function to generate request IDs
export const generateRequestId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
